import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { dishApi } from "src/api-requests/dish.apis";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Button } from "src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Textarea } from "src/components/ui/textarea";
import { DISH_STATUS, DISH_STATUS_VALUES } from "src/constants/types.constants";
import { getVietnameseDishStatus } from "src/lib/dashboard-utils";
import { createDishBodySchema, TCreateDishBody } from "src/validations/dish.validations";

export default function AddDishDialog() {
  const [previewThumbnailFile, setPreviewThumbnailFile] = useState<File | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const addNewDishForm = useForm<TCreateDishBody>({
    resolver: zodResolver(createDishBodySchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      image: null,
      status: DISH_STATUS.Available,
    },
  });

  const defaultThumbnail = addNewDishForm.watch("image");
  const dishName = addNewDishForm.watch("name");
  const previewThumbnailFromFile = useMemo(() => {
    if (previewThumbnailFile) {
      return URL.createObjectURL(previewThumbnailFile);
    }
    return defaultThumbnail;
  }, [previewThumbnailFile, defaultThumbnail]);

  const handleReset = () => {
    addNewDishForm.reset({
      name: "",
      price: 0,
      description: "",
      image: null,
      status: DISH_STATUS.Available,
    });
    setPreviewThumbnailFile(null);
  };

  const addDishMutation = useMutation({
    mutationFn: (body: TCreateDishBody) => dishApi.addDish(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      toast.success(
        <p>
          Món ăn <span className="font-bold">{dishName}</span> đã được thêm thành công
        </p>,
      );
      setOpen(false);
      handleReset();
    },
  });

  const handleAddDish = addNewDishForm.handleSubmit(async (data) => {
    try {
      await addDishMutation.mutateAsync(data);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <Dialog
      onOpenChange={setOpen}
      open={open}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-7 gap-1"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Thêm món ăn</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm món ăn</DialogTitle>
        </DialogHeader>
        <Form {...addNewDishForm}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-dish-form"
            onSubmit={handleAddDish}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={addNewDishForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start justify-start gap-2">
                      <Avatar className="aspect-square h-[100px] w-[100px] rounded-md object-cover">
                        <AvatarImage src={(previewThumbnailFromFile as string) ?? undefined} />
                        <AvatarFallback className="rounded-none">
                          {dishName || "Food"}
                        </AvatarFallback>
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
                control={addNewDishForm.control}
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
                control={addNewDishForm.control}
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
                control={addNewDishForm.control}
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
                control={addNewDishForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Trạng thái</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
            form="add-dish-form"
          >
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
