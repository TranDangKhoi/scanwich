"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { accountApi } from "src/api-requests/accounts.apis";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { TUpdateMeBody, updateMeBodySchema } from "src/validations/account.validations";

export default function UpdateProfileForm() {
  const router = useRouter();
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const updateProfileForm = useForm<TUpdateMeBody>({
    resolver: zodResolver(updateMeBodySchema),
    defaultValues: {
      avatar: "",
      name: "",
    },
  });

  const { data: myProfileData } = useQuery({
    queryKey: ["get-profile"],
    queryFn: accountApi.getMyProfile,
  });

  const defaultAvatarValues = updateProfileForm.watch("avatar");

  const updateProfileMutation = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: (body: TUpdateMeBody) => accountApi.updateMyProfile(body),
  });

  useEffect(() => {
    if (myProfileData) {
      updateProfileForm.reset({
        avatar: myProfileData?.payload.data.avatar ?? "",
        name: myProfileData?.payload.data.name,
      });
    }
  }, [myProfileData, updateProfileForm]);

  const handleUpdateProfile = updateProfileForm.handleSubmit((data) => {
    updateProfileMutation.mutate(data, {
      onSuccess: (data) => {
        toast.success(data.message);
        router.refresh();
      },
    });
  });

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
        noValidate
      >
        <Card x-chunk="dashboard-07-chunk-0">
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
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cove">
                        <AvatarImage src={previewAvatar ?? undefined} />
                        <AvatarFallback className="rounded-none font-bold">
                          {myProfileData?.payload.data.name.slice(0, 2).toUpperCase()}
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
