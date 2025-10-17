import type { BlockProps } from "../../core/types";

export interface ProfilePageProps extends BlockProps {
  firstName: string;
  secondName: string;
  displayName: string;
  login: string;
  email: string;
  phone: string;
}
