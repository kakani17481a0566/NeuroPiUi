// SubRowComponent.jsx
export function SubRowComponent({ row }) {
  const weekData = row.original;
  
  return (
    <div className="sticky border-b border-b-gray-200 bg-gray-50 pb-4 pt-3 dark:border-b-dark-500 dark:bg-dark-750 ltr:left-0 rtl:right-0">
      <p className="mt-1 px-4 font-medium text-gray-800 dark:text-dark-100 sm:px-5 lg:ltr:ml-14 rtl:rtl:mr-14">
        Details for {weekData.weekPeriod}
      </p>

      {/* Add any additional details you want to show in the expanded row */}
      <div className="mt-4 px-4 sm:px-5 lg:ltr:ml-14 rtl:rtl:mr-14">
        <div className="rounded-md border border-gray-200 p-3 text-sm-plus dark:border-dark-500">
          {/* Add specific details about the week here */}
        </div>
      </div>
    </div>
  );
}