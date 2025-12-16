"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useEffect as useLayoutEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { dishApi } from "src/api-requests/dish.apis";
import { mediaApi } from "src/api-requests/media.apis";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Button } from "src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Textarea } from "src/components/ui/textarea";
import { DISH_STATUS, DISH_STATUS_VALUES } from "src/constants/types.constants";
import { getVietnameseDishStatus } from "src/lib/dashboard-utils";
import { handleErrorApi } from "src/lib/utils";
import { TUpdateDishBody, updateDishBodySchema } from "src/validations/dish.validations";

export default function EditDishDialog({
  id,
  setId,
}: {
  id?: number | undefined;
  setId: React.Dispatch<React.SetStateAction<number | undefined>>;
}) {
  const [previewThumbnailFile, setPreviewThumbnailFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const editDishForm = useForm<TUpdateDishBody>({
    resolver: zodResolver(updateDishBodySchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: "",
      status: DISH_STATUS.Unavailable,
    },
  });
  const dishImage = editDishForm.watch("image");
  const dishName = editDishForm.watch("name");
  const previewAvatarFromFile = useMemo(() => {
    if (previewThumbnailFile) {
      return URL.createObjectURL(previewThumbnailFile);
    }
    return dishImage;
  }, [previewThumbnailFile, dishImage]);

  const { data: dishDetail } = useQuery({
    queryKey: ["dish", id],
    queryFn: () => dishApi.getDishDetail(id!),
    enabled: Boolean(id),
  });

  const uploadImageMutation = useMutation({
    mutationKey: ["upload-image"],
    mutationFn: (body: FormData) => mediaApi.uploadImage(body),
  });

  const editDishMutation = useMutation({
    mutationFn: (body: TUpdateDishBody) => dishApi.updateDish(id!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      setId(undefined);
      toast.success(
        <p>
          Món ăn <span className="font-bold">{dishName}</span> đã được cập nhật thành công
        </p>,
      );
    },
  });

  const dish = dishDetail?.payload.data;

  const handleReset = () => {
    editDishForm.reset({
      name: dish?.name,
      description: dish?.description,
      price: dish?.price,
      image: dish?.image,
      status: dish?.status,
    });
    // Clear preview image
    setPreviewThumbnailFile(null);
  };

  const handleEditDish = editDishForm.handleSubmit(async (data) => {
    let newThumbnailUrl = null;
    try {
      if (previewThumbnailFile) {
        const formData = new FormData();
        formData.append("file", previewThumbnailFile);
        const result = await uploadImageMutation.mutateAsync(formData);
        newThumbnailUrl = result.payload.data;
      }
      editDishMutation.mutate({
        ...data,
        image: newThumbnailUrl ?? dishImage,
      });
    } catch (err) {
      handleErrorApi({
        error: err,
        setError: editDishForm.setError,
        defaultMessage: "Có lỗi xảy ra khi cập nhật thông tin món ăn",
      });
    }
  });

  useLayoutEffect(() => {
    if (dish && id) {
      editDishForm.reset({
        name: dish.name,
        description: dish.description,
        price: dish.price,
        image: dish.image,
        status: dish.status,
      });
    }
  }, [dish, editDishForm, id]);

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
        }
      }}
    >
      <DialogContent className="max-h-screen overflow-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cập nhật món ăn</DialogTitle>
          <DialogDescription>Các trường sau đây là bắt buộc: Tên, ảnh</DialogDescription>
        </DialogHeader>
        <Form {...editDishForm}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-dish-form"
            onSubmit={handleEditDish}
            onReset={handleReset}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={editDishForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start justify-start gap-2">
                      <Avatar className="aspect-square h-[100px] w-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatarFromFile as string} />
                        <AvatarFallback className="rounded-none">{dishName || "Avatar"}</AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPreviewThumbnailFile(file);
                            field.onChange("http://localhost:3000/" + file.name);
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={editDishForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Tên món ăn</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="name"
                          className="w-full"
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={editDishForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Giá</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="price"
                          className="w-full"
                          {...field}
                          type="number"
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={editDishForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Mô tả sản phẩm</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Textarea
                          id="description"
                          className="w-full"
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={editDishForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Trạng thái</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DISH_STATUS_VALUES.map((status) => (
                              <SelectItem
                                key={status}
                                value={status}
                              >
                                {getVietnameseDishStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="edit-dish-form"
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
