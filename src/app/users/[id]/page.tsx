import SingleUserInfo from "@/components/template/SingleUSerInfo";
import { IProps } from "@/types/ComponentsProps";

export default function UserDetailPage({ params }: IProps) {
  const { id } = params;
  return <SingleUserInfo id={id} />;
}
