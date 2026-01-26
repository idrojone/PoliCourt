import { useState, useEffect } from "react";
import UsersList from "@/features/auth/components/users-list";
import { useUsersAllQuery } from "@/features/auth/queries/useUsersAllQuery";
import { useUsersSearchQuery } from "@/features/auth/queries/useUsersSearchQuery";
import { DashboardLayout } from "@/layout/dashboard";
import { Input } from "@/components/ui/input";

export const DashboardUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const isSearching = debouncedSearchTerm.length > 0;

  const {
    data: allUsersData,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
  } = useUsersAllQuery(!isSearching);

  const {
    data: searchedUsersData,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
    error: errorSearch,
  } = useUsersSearchQuery(debouncedSearchTerm);

  const users = isSearching ? searchedUsersData?.data : allUsersData?.data;
  const isLoading = isSearching ? isLoadingSearch : isLoadingAll;
  const isError = isSearching ? isErrorSearch : isErrorAll;
  const error = isSearching ? errorSearch : errorAll;

  return (
    <DashboardLayout title="Usuarios">
      <div className="mb-4">
        <Input
          placeholder="Buscar por username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <UsersList
        users={users}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </DashboardLayout>
  );
};
