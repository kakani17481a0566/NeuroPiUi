import { Page } from "components/shared/Page";
import OrdersDatatableV2 from "app/pages/tables/UserList"; // verify this path is correct

export default function Home() {
  return (
    <Page title="Homepage">
      <div className="transition-content w-full px-[var(--margin-x)] pt-5 lg:pt-6">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            User List
          </h2>
          
          <div className="mt-4"> {/* Added margin top for better spacing */}
            <OrdersDatatableV2 />
          </div>
        </div>
      </div>
    </Page>
  );
}