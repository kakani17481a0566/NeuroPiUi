// rows.jsx
import { Badge } from "components/ui";
import { userStatusOptions } from "./data";

/**
 * Custom cell component for displaying topics and worksheets in a grid layout
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of period objects containing topics and worksheets
 */
export const TopicWorksheetCell = ({ data }) => {
    if (!data || data.length === 0 || data.every(p => p.topics.length === 0 && p.worksheets.length === 0)) {
        return <div className="p-2 text-gray-400 italic text-sm">No activities</div>;
    }

    return (
        <div className="flex flex-col space-y-1 p-2">
            {data.map((periodContent, index) => (
                <div 
                    key={`${periodContent.periodName}-${index}`} 
                    className="text-sm border-b border-gray-200 last:border-b-0 pb-1 last:pb-0"
                >
                    {periodContent.topics.length > 0 && (
                        <p className="font-medium text-gray-800 dark:text-dark-100">
                            {periodContent.topics.join('; ')}
                        </p>
                    )}
                    {periodContent.worksheets.length > 0 && (
                        <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
                            <span className="font-semibold">WS:</span> {periodContent.worksheets.join('; ')}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};

// WEEK
export const WeekCell = ({ getValue }) => {
    return <span className="font-medium text-gray-800 dark:text-dark-100">{getValue()}</span>;
};

// FAIRY TALE
export const FairyTaleCell = ({ getValue }) => {
    return (
        <span className="font-medium text-primary-600 dark:text-primary-400">
            {getValue()}
        </span>
    );
};

// MONDAY
export const MondayCell = ({ getValue }) => {
    return <span className="text-gray-800 dark:text-dark-100">{getValue() || '-'}</span>;
};

// TUESDAY
export const TuesdayCell = ({ getValue }) => {
    return <span className="text-gray-600 dark:text-gray-300">{getValue() || '-'}</span>;
};

// WEDNESDAY
export const WednesdayCell = ({ getValue }) => {
    return <span className="text-gray-800 dark:text-dark-100">{getValue() || '-'}</span>;
};

// THURSDAY
export const ThursdayCell = ({ getValue }) => {
    const status = getValue();
    const statusOption = userStatusOptions.find(opt => opt.value === status) || userStatusOptions[0];
    
    return (
        <Badge color={statusOption.color} className="capitalize">
            {statusOption.label}
        </Badge>
    );
};

// FRIDAY
export const FridayCell = ({ getValue }) => {
    return <span className="text-gray-800 dark:text-dark-100">{getValue() || '-'}</span>;
};

// SATURDAY
export const SaturdayCell = ({ row }) => {
    const value = row.original.saturdayActivity || "-";
    return <span className="text-gray-800 dark:text-dark-100">{value}</span>;
};

// Default export for backward compatibility
export default {
    WeekCell,
    FairyTaleCell,
    MondayCell,
    TuesdayCell,
    WednesdayCell,
    ThursdayCell,
    FridayCell,
    SaturdayCell,
    TopicWorksheetCell
};