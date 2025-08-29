import Link from "next/link";
import { ChevronDown } from "lucide-react";

type CategoryType = {
  id: number;
  name: string;
  subcategories?: CategoryType[];
};

const DropdownCategory: React.FC<{ category: CategoryType }> = ({
  category,
}) => {
  return (
    <div className="relative group">
      {/* Main Category Button (now clickable link) */}
      <Link
        href={`/products?categoryId=${category.id}`}
        className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
      >
        <span className="font-medium capitalize">{category.name}</span>
        {category.subcategories?.length ? (
          <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
        ) : null}
      </Link>

      {/* Subcategories Dropdown */}
      {category.subcategories?.length ? (
        <div className="absolute top-full left-0 w-56 bg-white shadow-lg rounded-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2 transition-all duration-200 z-20">
          <ul className="py-2">
            {category.subcategories.map((sub) => (
              <li key={sub.id} className="relative group/sub">
                <Link
                  href={`/products?category=${sub.id}`}
                  className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors rounded-md"
                >
                  <span className="capitalize">{sub.name}</span>
                  {sub.subcategories?.length ? (
                    <ChevronDown className="w-3 h-3 ml-2 rotate-[-90deg] group-hover/sub:rotate-0 transition-transform" />
                  ) : null}
                </Link>

                {/* Nested Dropdown (Second Level) */}
                {sub.subcategories?.length ? (
                  <div className="absolute top-0 left-full w-56 bg-white shadow-lg rounded-lg border border-gray-100 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible translate-x-0 transition-all duration-200 z-30">
                    <ul className="py-2">
                      {sub.subcategories.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/products?category=${child.id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors rounded-md"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default DropdownCategory;
