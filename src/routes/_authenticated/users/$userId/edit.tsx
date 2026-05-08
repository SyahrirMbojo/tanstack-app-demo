import MainPage from "#/components/MainPage";
import UserForm from "#/routes/_authenticated/users/_components/-UserForm";
import {
  getUserRecord,
  updateUserRecord,
  type UserFormInput,
} from "#/routes/_authenticated/users/_server/-users";
import {
  createFileRoute,
  notFound,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/users/$userId/edit")({
  loader: async ({ params }) => {
    const userId = Number(params.userId);

    if (!Number.isInteger(userId)) {
      throw notFound();
    }

    const user = await getUserRecord({ data: { id: userId } });

    if (!user) {
      throw notFound();
    }

    return user;
  },
  component: EditUserPage,
});

function EditUserPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const user = Route.useLoaderData();

  const initialValue: UserFormInput = {
    id: user.id,
    name: user.name,
    gender: user.gender,
    phone: user.phone ?? "",
    email: user.email ?? "",
    address: user.address ?? "",
    username: user.username,
    password: "",
  };

  const goToUsers = () => {
    navigate({
      to: "/users",
      search: { page: 1, pageSize: 10, q: "" },
    });
  };

  const handleSubmit = async (data: UserFormInput) => {
    await updateUserRecord({ data: { ...data, id: user.id } });
    await router.invalidate();
    goToUsers();
  };

  return (
    <MainPage title="Edit User" desc={`Update account data for ${user.name}`}>
      <UserForm
        initialValue={initialValue}
        mode="edit"
        onCancel={goToUsers}
        onSubmit={handleSubmit}
      />
    </MainPage>
  );
}
