import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
  titleName: string;
}
const Breadcrumb = ({ pageName, titleName }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {titleName}
      </h2>
      <button className="hover:text-warning">
        <FontAwesomeIcon icon={faEdit} key={"5xl"} size="xs" />
      </button>
      <button className="hover:text-danger">
        <FontAwesomeIcon icon={faTrash} size="xs" key={"5xl"} />
      </button>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
