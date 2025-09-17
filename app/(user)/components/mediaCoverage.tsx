"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchMediaCoverages,
  deleteMediaCoverage,
  toggleMediaCoverageStatus,
  MediaCoverage,
  setCurrentCoverage,
  clearCurrentCoverage,
} from "@/app/lib/store/features/mediaCoverageSlice";
import { Plus, Trash2, Edit, Eye, EyeOff, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/app/utils/getImageUrl";
import Heading from "@/app/commonComponents/heading";

const MediaCoveragePage = () => {
  const dispatch = useAppDispatch();
  const { coverages, status, currentCoverage } = useAppSelector(
    (state) => state.mediaCoverages
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMediaCoverages();
  }, []);

  const loadMediaCoverages = async () => {
    try {
      setIsLoading(true);
      await dispatch(fetchMediaCoverages()).unwrap();
    } catch (error) {
      toast.error("Failed to load media coverages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this media coverage?")) {
      try {
        await dispatch(deleteMediaCoverage(id)).unwrap();
        toast.success("Media coverage deleted successfully");
      } catch (error) {
        toast.error("Failed to delete media coverage");
      }
    }
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
          ⭐ Media <span className="text-blue-600">Coverage</span>
        </h2>
        <p className="mt-3 text-gray-600 text-base lg:text-lg">
          Discover insights, stories, and trends shaping the creative world.
        </p>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : coverages.length === 0 ? (
              <div className="text-center py-10">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No media coverages
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {coverages.map((coverage) => (
                  <a
                    key={coverage.id}
                    href={coverage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-56 w-full overflow-hidden">
                      <img
                        src={getImageUrl(coverage.imageUrl)}
                        alt={coverage.title}
                        className="h-full w-full object-cover transform group-hover:scale-105 transition duration-500"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition"></div>

                      {/* External link icon */}
                      <ExternalLink
                        className="absolute top-3 right-3 text-white opacity-80 group-hover:opacity-100"
                        size={20}
                      />
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 p-4 text-white">
                      <h3 className="text-lg font-semibold line-clamp-2">
                        {coverage.title}
                      </h3>

                      {/* Hover CTA */}
                      <span className="mt-3 inline-block text-sm font-medium text-blue-300 opacity-0 group-hover:opacity-100 transition">
                        Read Full Article →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCoveragePage;
