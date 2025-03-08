"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { accountApi } from "src/api-requests/accounts.apis";
import { mediaApi } from "src/api-requests/media.apis";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { handleErrorApi } from "src/lib/utils";
import { TUpdateMeBody, updateMeBodySchema } from "src/validations/account.validations";

// LƯU Ý VỀ LOGIC Ở FILE NÀY:
// - Khi người dùng tải ảnh lên, ảnh sẽ được lưu vào biến previewImageFile, lúc này thì ảnh sẽ vẫn ở dạng File và hiển thị dưới dạng preview thôi, chứ chưa tạo URL gì cho ảnh cả
// - Khi người dùng submit form rồi, ảnh sẽ được lưu vào database dưới dạng URL rồi lúc này chúng ta sẽ dùng chính URL đó để hiển thị chính thức dưới dạng Avatar
// Vì vậy nên mới sinh ra 2 types dành cho avatar là string | File
export default function UpdateProfileForm() {
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const updateProfileForm = useForm<TUpdateMeBody>({
    resolver: zodResolver(updateMeBodySchema),
    defaultValues: {
      avatar: "",
      name: "",
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["get-profile"],
    queryFn: accountApi.getMyProfile,
  });

  const defaultAvatarValues = updateProfileForm.watch("avatar");

  const updateProfileMutation = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: (body: TUpdateMeBody) => accountApi.updateMyProfile(body),
  });

  const uploadImageMutation = useMutation({
    mutationKey: ["upload-image"],
    mutationFn: (body: FormData) => mediaApi.uploadImage(body),
  });

  useEffect(() => {
    if (profile) {
      updateProfileForm.reset({
        avatar: profile.payload.data.avatar ?? "",
        name: profile.payload.data.name,
      });
    }
  }, [profile, updateProfileForm]);

  const handleUpdateProfile = updateProfileForm.handleSubmit(async (data) => {
    let newAvatarUrl = null;
    try {
      if (previewImageFile) {
        const formData = new FormData();
        formData.append("file", previewImageFile);
        const result = await uploadImageMutation.mutateAsync(formData);
        newAvatarUrl = result.payload.data;
      }

      updateProfileMutation.mutate(
        {
          name: data.name,
          // Nếu người dùng không chọn ảnh nào thì sẽ giữ nguyên avatar cũ
          avatar: previewImageFile ? newAvatarUrl : defaultAvatarValues,
        },
        {
          onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["get-profile"] });
            toast.success(data.message);
          },
        },
      );
    } catch (error) {
      handleErrorApi({
        error,
        defaultMessage: "Có lỗi xảy ra khi cập nhật thông tin cá nhân",
      });
    }
  });

  const handleResetForm = () => {
    updateProfileForm.reset({
      avatar: profile?.payload.data.avatar ?? "",
      name: profile?.payload.data.name,
    });
    // Clear preview image
    setPreviewImageFile(null);
  };

  const previewAvatar = useMemo(() => {
    if (previewImageFile) {
      return URL.createObjectURL(previewImageFile);
    }
    return defaultAvatarValues;
  }, [defaultAvatarValues, previewImageFile]);

  return (
    <Form {...updateProfileForm}>
      <form
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onSubmit={handleUpdateProfile}
        onReset={handleResetForm}
        noValidate
      >
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={updateProfileForm.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="shrink-0 rounded-md object-cover w-[100px] h-[100px]">
                        <AvatarImage src={(previewAvatar as string) ?? undefined} />
                        <AvatarFallback className="rounded-none font-bold flex items-center shrink-0 justify-center">
                          {profile?.payload.data.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPreviewImageFile(file);
                            field.onChange(file);
                          }
                        }}
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        onClick={() => {
                          avatarInputRef.current?.click();
                        }}
                        type="button"
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={updateProfileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="name">Tên</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className=" items-center gap-2 md:ml-auto flex">
                <Button
                  variant="outline"
                  size="sm"
                  type="reset"
                >
                  Hủy
                </Button>
                <Button
                  size="sm"
                  type="submit"
                >
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
