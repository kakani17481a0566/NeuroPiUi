import { useState, useEffect } from "react";

// const grades = ["A+", "A", "B"];
export default function RowActions({ row }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGrades, setSelectedGrades] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [gradeOptions, setGradeOptions] = useState([]);


    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const res = await fetch("https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Grade/1");
                const data = await res.json();
                setGradeOptions(data.data || []); // Expected: { grades: ["A+", "A", "B"] }
            } catch (err) {
                console.error("Failed to fetch grade options", err);
            }
        };

        fetchGrades();
    }, []);
    const handleAssignMarks = () => {
        // const subjects = Object.keys(row.grades || { Math: "", Science: "", English: "" }); // fallback
        // const emptyGrades = Object.fromEntries(subjects.map((subject) => [subject, ""]));
        // setSelectedGrades(emptyGrades);
        setSelectedGrades({ ...(row.grades || {}) });
        setIsEditMode(false);
        setIsModalOpen(true);
    };



    const handleEdit = () => {
        setSelectedGrades({ ...(row.grades || {}) });
        setIsEditMode(true);
        setIsModalOpen(true);
    };


    const handleGradeChange = (subject, grade) => {
        setSelectedGrades((prev) => ({ ...prev, [subject]: grade }));
    };
    const handleSave = async () => {
        try {
            const payload = {
                studentId: row.studentId,
                grades: selectedGrades,
            };

            const response = await fetch("/api/assign-grades", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to save grades");

            const result = await response.json();
            console.log("Grades saved successfully:", result);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving grades:", error);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handleAssignMarks}
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
                Assign Marks
            </button>
            <button
                onClick={handleEdit}
                className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
                Edit
            </button>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">
                            {isEditMode ? "Edit Marks for" : "Assign Marks to"} {row.name}
                        </h2>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto">
                            {Object.keys(row.grades || {}).map((subject) => (
                                <div key={subject}>
                                    <label className="block font-medium text-sm">{subject}</label>
                                    <select
                                        value={selectedGrades[subject] || ""}
                                        onChange={(e) => handleGradeChange(subject, e.target.value)}
                                        className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
                                    >
                                        <option value={selectedGrades[subject] || ""}>
                                            {selectedGrades[subject] || "Select Grade"}
                                        </option>
                                        {gradeOptions.map((g) => (
                                            <option key={g.id} value={g.name}>
                                                {g.name}
                                            </option>
                                        ))}

                                    </select>
                                </div>
                            ))}

                        </div>
                        <div className="flex justify-end mt-6 gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded bg-gray-300 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div >


    );
}
