"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchSections,
  deleteSection,
} from "@/app/lib/store/features/sectionSlice";
import { Plus, Trash2 } from "lucide-react";
import AddSectionForm from "../../components/addSection";
import SidebarForm from "../../components/SidebarForm";

export default function SectionManager() {
  const dispatch = useAppDispatch();
  const { sections, loading } = useAppSelector((state) => state.section);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Sections</h1>
        <SidebarForm
          title="Add Section"
          trigger={
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Section
            </button>
          }
        >
          <AddSectionForm />
        </SidebarForm>
      </div>

      <div>
        {loading && <p>Loading...</p>}
        {!loading && sections.length === 0 && <p>No sections found.</p>}
        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm"
            >
              <div>
                <h3 className="font-semibold">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {section.type}
                </span>
              </div>
              <button
                onClick={() => dispatch(deleteSection(section.id))}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
