import type { BlockProps } from "../../core/types";

export interface ProfilePageProps extends BlockProps {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}
