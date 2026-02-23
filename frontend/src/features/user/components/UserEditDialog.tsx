import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { User } from "@/features/types/user/User";
import { useUserUpdateMutation } from "../mutations/useUserUpdateMutation";

// schema identical to UserProfile but without password
const updateSchema = z.object({
    firstName: z.string().min(1, { message: "El nombre es obligatorio" }),
    lastName: z.string().min(1, { message: "El apellido es obligatorio" }),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    avatarUrl: z.string().url({ message: "URL de avatar no válida" }).optional(),
});

type UpdateFormValues = z.infer<typeof updateSchema>;

interface UserEditDialogProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const UserEditDialog: React.FC<UserEditDialogProps> = ({
    user,
    open,
    onOpenChange,
}) => {
    const updateMutation = useUserUpdateMutation();

    const form = useForm<UpdateFormValues>({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone || "",
            dateOfBirth: user.dateOfBirth || "",
            gender: user.gender || "",
            avatarUrl: user.avatarUrl || "",
        },
    });

    useEffect(() => {
        form.reset({
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone || "",
            dateOfBirth: user.dateOfBirth || "",
            gender: user.gender || "",
            avatarUrl: user.avatarUrl || "",
        });
    }, [user]);

    const onSubmit = (data: UpdateFormValues) => {
        const payload: any = { ...data };
        Object.keys(payload).forEach((k) => {
            if (payload[k] === "") delete payload[k];
        });
        updateMutation.mutate(
            { username: user.username, payload },
            {
                onSuccess: () => {
                    toast.success("Perfil actualizado");
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error("Error al actualizar el perfil");
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar perfil</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Apellidos</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teléfono</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de nacimiento</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Género</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="avatarUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Avatar URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
