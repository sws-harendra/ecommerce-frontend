"use client";
import React, { useState } from "react";
import { useAppDispatch } from "@/app/lib/store/store";
import {
  createTestimonial,
  updateTestimonial,
  Testimonial,
} from "@/app/lib/store/features/testimonialSlice";
import { toast } from "sonner";

interface Props {
  testimonial?: Testimonial;
  onSuccess?: () => void;
}

export default function TestimonialForm({ testimonial, onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    name: testimonial?.name || "",
    designation: testimonial?.designation || "",
    message: testimonial?.message || "",
    image: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("designation", form.designation);
      data.append("message", form.message);
      if (form.image) data.append("image", form.image);

      if (testimonial) {
        await dispatch(
          updateTestimonial({ id: testimonial.id, data })
        ).unwrap();
        toast.success("Testimonial updated");
      } else {
        await dispatch(createTestimonial(data)).unwrap();
        toast.success("Testimonial created");
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error("Failed to save testimonial");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Designation</label>
        <input
          type="text"
          name="designation"
          value={form.designation}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          rows={4}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Image</label>
        <input type="file" accept="image/*" onChange={handleFile} />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        {testimonial ? "Update" : "Create"}
      </button>
    </form>
  );
}
