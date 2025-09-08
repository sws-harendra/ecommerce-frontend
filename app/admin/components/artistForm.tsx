import React, { useState } from "react";
import { useAppDispatch } from "@/app/lib/store/store";
import {
  createArtist,
  updateArtist,
} from "@/app/lib/store/features/artistSlice";

interface Props {
  artist?: any;
  onClose: () => void;
}

const ArtistForm: React.FC<Props> = ({ artist, onClose }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(artist?.name || "");
  const [isActive, setIsActive] = useState(artist?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(artist?.isFeatured ?? false);
  const [aboutArtist, setAboutArtist] = useState(artist?.aboutArtist || "");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("isActive", String(isActive));
    formData.append("isFeatured", String(isFeatured));
    formData.append("aboutArtist", aboutArtist);
    if (image) formData.append("image", image);

    if (artist) {
      dispatch(updateArtist({ id: artist.id, data: formData }));
    } else {
      dispatch(createArtist(formData));
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        value={name}
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        className="border px-2 py-1 rounded"
        required
      />
      <textarea
        value={aboutArtist}
        placeholder="About Artist"
        onChange={(e) => setAboutArtist(e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && setImage(e.target.files[0])}
      />
      <div className="flex gap-4">
        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
          />{" "}
          Active
        </label>
        <label>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={() => setIsFeatured(!isFeatured)}
          />{" "}
          Featured
        </label>
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {artist ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default ArtistForm;
