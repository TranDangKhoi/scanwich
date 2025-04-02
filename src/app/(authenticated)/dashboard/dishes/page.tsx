"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
import { createDishBodySchema, TCreateDishBody } from "src/validations/dish.validations";
// import { getVietnameseDishStatus } from "src/lib/utils";

export default function DashboardDishesPage() {
  return <div></div>;
}
