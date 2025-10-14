import EventBus from './event-bus';
import { nanoid } from 'nanoid';
import Handlebars from 'handlebars';
import type { BlockProps, Nullable } from './types';

type PropsAndChildren = {
  props: BlockProps;
  children: Record<string, Block | Block[]>;
};

export default abstract class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const;

  _element: Nullable<HTMLElement> = null;
  _meta: Nullable<{ tagName: string; props: BlockProps }> = null;
  _id = nanoid(7);
  props: BlockProps;
  children: Record<string, Block | Block[]> = {};
  children2?: Record<string, Block>;
  eventBus: () => EventBus;

  constructor(
    tagName = 'div',
    propsWithChildren: PropsAndChildren['props'] = {}
  ) {
    const eventBus = new EventBus();
    this.eventBus = () => eventBus;

    const { props, children } = this._getChildrenAndProps(propsWithChildren);
    this.children = children;

    this._meta = {
      tagName,
      props,
    };

    this.props = this._makePropsProxy(props);

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  _createResources() {
    if (!this._meta) {
      return;
    }
    const { tagName, props } = this._meta;
    this._element = this._createDocumentElement(tagName);

    if (!this._element) {
      throw new Error('Error creating DOM element');
    }

    if (typeof props.className === 'string') {
      const classes = props.className.split(' ').filter(Boolean);
      this._element.classList.add(...classes);
    }

    if (typeof props.attrs === 'object' && props.attrs !== null) {
      Object.entries(props.attrs).forEach(([attrName, attrValue]) => {
        this._element!.setAttribute(attrName, attrValue);
      });
    }
  }

  init() {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  _getChildrenAndProps(
    propsAndChildren: PropsAndChildren['props']
  ): PropsAndChildren {
    const children: PropsAndChildren['children'] = {};
    const props: PropsAndChildren['props'] = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((obj) => {
          if (obj instanceof Block) {
            children[key] = value;
          } else {
            props[key] = value;
          }
        });
        props[key] = value;
        return;
      }
      if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props };
  }

  _componentDidMount() {
    this.componentDidMount();
  }

  componentDidMount() {}

  dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  _componentDidUpdate(oldProps: BlockProps, newProps: BlockProps) {
    const renderUpdate = this.componentDidUpdate(oldProps, newProps);
    if (!renderUpdate) {
      return;
    }
    this._render();
  }

  componentDidUpdate(oldProps: BlockProps, newProps: BlockProps) {
    return oldProps !== newProps;
  }

  setProps = (nextProps: BlockProps) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  get element() {
    return this._element;
  }

  _addEvents() {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      if (!this._element) {
        throw new Error('No element to add event');
      }
      this._element.addEventListener(eventName, events[eventName]);
    });
  }

  _removeEvents() {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      if (!this._element) {
        throw new Error('No element to remove event');
      }

      this._element.removeEventListener(eventName, events[eventName]);
    });
  }

  _compile() {
    const propsAndStubs: Record<string, unknown> = {
      ...this.props,
      children2: this.children2 || {},
    };

    Object.entries(this.children).forEach(([key, child]) => {
      if (Array.isArray(child)) {
        propsAndStubs[key] = child.map(
          (component) => `<div data-id="${component._id}"></div>`
        );
      } else {
        propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
      }
    });

    const fragment = this._createDocumentElement(
      'template'
    ) as HTMLTemplateElement;

    const template = Handlebars.compile(this.render());
    fragment.innerHTML = template(propsAndStubs);

    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((component) => {
          const stub = fragment.content.querySelector(
            `[data-id="${component._id}"]`
          );
          const componentContent = component.getContent();
          if (!componentContent) {
            throw new Error('No component content');
          }
          stub?.replaceWith(componentContent);
        });
      } else {
        const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);

        const childContent = child.getContent();
        if (!childContent) {
          throw new Error('No child content');
        }
        stub?.replaceWith(childContent);
      }
    });

    Object.entries(propsAndStubs.children2 || {}).forEach(([id, component]) => {
      const stub = fragment.content.querySelector(`[data-id="${id}"]`);

      if (!stub) {
        return;
      }
      const content = component.getContent();
      stub.replaceWith(content);
    });

    return fragment.content;
  }

  _render() {
    this._removeEvents();
    const block = this._compile();

    if (!this._element) {
      throw new Error('No element to render');
    }

    this._element.innerHTML = '';
    this._element.appendChild(block);

    this._addEvents();
  }

  render() {
    return '';
  }

  getContent() {
    return this.element;
  }

  _makePropsProxy(props: BlockProps) {
    const eventBus = this.eventBus();
    const emitBind = eventBus.emit.bind(eventBus);

    return new Proxy(props, {
      get(target, prop) {
        const typedProp = prop as keyof BlockProps;
        const value = target[typedProp];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target, prop, value) {
        const oldTarget = { ...target };
        const typedProp = prop as keyof BlockProps;
        target[typedProp] = value;

        emitBind(Block.EVENTS.FLOW_CDU, oldTarget, target);
        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    });
  }

  _createDocumentElement(tagName: string) {
    return document.createElement(tagName);
  }

  show() {
    const content = this.getContent();
    if (!content) {
      throw new Error('No element to show');
    }
    content.style.display = 'block';
  }

  hide() {
    const content = this.getContent();
    if (!content) {
      throw new Error('No element to hide');
    }
    content.style.display = 'none';
  }

  getChild(key: string): Block | null {
    const child = this.children[key];
    return child && !Array.isArray(child) ? child : null;
  }
}
