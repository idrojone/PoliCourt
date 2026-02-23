import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { User } from "@/features/types/user/User";
import { useUserUpdateMutation } from "../mutations/useUserUpdateMutation";
import {
    Button,
} from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Calendar, Shield, CheckCircle, User as UserIcon } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileProps {
    profile: User;
    editable?: boolean;
}

const updateSchema = z.object({
    firstName: z.string().min(1, { message: "El nombre es obligatorio" }),
    lastName: z.string().min(1, { message: "El apellido es obligatorio" }),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    avatarUrl: z.string().url({ message: "URL de avatar no válida" }).optional(),
});

type UpdateFormValues = z.infer<typeof updateSchema>;

export const UserProfile = ({ profile, editable = false }: UserProfileProps) => {
    const updateMutation = useUserUpdateMutation();

    const form = useForm<UpdateFormValues>({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone || "",
            dateOfBirth: profile.dateOfBirth || "",
            gender: profile.gender || "",
            avatarUrl: profile.avatarUrl || "",
        },
    });

    // if profile changes, reset form values
    useEffect(() => {
        form.reset({
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone || "",
            dateOfBirth: profile.dateOfBirth || "",
            gender: profile.gender || "",
            avatarUrl: profile.avatarUrl || "",
        });
    }, [profile]);

    const onSubmit = (data: UpdateFormValues) => {
        // remove empty password because API may treat as change
        const payload: any = { ...data };
        if (!payload.password) {
            delete payload.password;
        }
        // clean up blank strings
        Object.keys(payload).forEach((key) => {
            if (payload[key] === "") {
                delete payload[key];
            }
        });

        updateMutation.mutate({ username: profile.username, payload });
    };

    const initials = () => {
        const full = `${profile.firstName} ${profile.lastName}`.trim();
        if (!full) return profile.username.substring(0, 2).toUpperCase();
        const parts = full.split(" ");
        if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        return full.substring(0, 2).toUpperCase();
    };

    const avatarColor = () => {
        const username = profile.username || "";
        const colors = [
            "bg-red-500",
            "bg-blue-500",
            "bg-green-500",
            "bg-yellow-500",
            "bg-purple-500",
            "bg-pink-500",
            "bg-indigo-500",
        ];
        let hash = 0;
        for (let i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    if (!editable) {
        return (
            <div className="max-w-md mx-auto">
                <Card>
                    <CardContent>
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={profile.avatarUrl} alt={profile.username} />
                                <AvatarFallback className={`${avatarColor()} text-white`}>{initials()}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-2xl font-semibold">
                                {profile.firstName} {profile.lastName}
                            </h2>
                            <p className="text-sm text-muted-foreground">@{profile.username}</p>
                        </div>

                        <div className="mt-6 space-y-4 text-sm">
                            <div className="flex items-center">
                                <Mail className="mr-2 w-4 h-4 text-muted-foreground" />
                                <span>{profile.email}</span>
                            </div>
                            {profile.phone && (
                                <div className="flex items-center">
                                    <Phone className="mr-2 w-4 h-4 text-muted-foreground" />
                                    <span>{profile.phone}</span>
                                </div>
                            )}
                            {profile.dateOfBirth && (
                                <div className="flex items-center">
                                    <Calendar className="mr-2 w-4 h-4 text-muted-foreground" />
                                    <span>{profile.dateOfBirth}</span>
                                </div>
                            )}
                            {profile.gender && (
                                <div className="flex items-center">
                                    <UserIcon className="mr-2 w-4 h-4 text-muted-foreground" />
                                    <span>{profile.gender}</span>
                                </div>
                            )}
                            <div className="flex items-center">
                                <Shield className="mr-2 w-4 h-4 text-muted-foreground" />
                                <span>{profile.role}</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="mr-2 w-4 h-4 text-muted-foreground" />
                                <span>{profile.status}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto">
            <div className="flex flex-col items-center space-y-4 mb-4">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatarUrl} alt={profile.username} />
                    <AvatarFallback className={`${avatarColor()} text-white`}>{initials()}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-semibold">
                    @{profile.username}
                </h2>
            </div>
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
                    <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};
