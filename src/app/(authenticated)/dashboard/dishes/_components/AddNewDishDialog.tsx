import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TCreateDishBody } from "src/validations/dish.validations";

export default function AddNewDishDialog() {
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const addNewDishForm = useForm<TCreateDishBody>({});
  return <div></div>;
}
