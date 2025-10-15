import Block from "../../core/block";

interface NavigateProps {
  pages: string[];
}

export default class NavigatePage extends Block {
  constructor(props: NavigateProps) {
    super("main", { ...props });
  }

  public render(): string {
    return `
            <section class="navigate-container">
                <h1>Pages</h1>
                <nav>
                <ul>
                    {{#each pages}}
                        <li><a href="#" page="{{this}}">{{this}}</a></li>
                    {{/each}}
                </ul>
                </nav>
            </section>
        `;
  }
}
