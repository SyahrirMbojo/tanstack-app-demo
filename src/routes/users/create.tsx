import MainPage from "#/components/MainPage";
import UserForm from "#/routes/users/components/-UserForm";
import { createUserRecord, type UserFormInput } from "#/controllers/users";
import { checkMiddleware } from "#/middleware";
import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";

const EMPTY_FORM: UserFormInput = {
  name: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  username: "",
  password: "",
};

export const Route = createFileRoute("/users/create")({
  beforeLoad: async () => checkMiddleware(),
  component: CreateUserPage,
});

function CreateUserPage() {
  const navigate = useNavigate();
  const router = useRouter();

  const goToUsers = () => {
    navigate({
      to: "/users",
      search: { page: 1, pageSize: 10, q: "" },
    });
  };

  const handleSubmit = async (data: UserFormInput) => {
    await createUserRecord({ data });
    await router.invalidate();
    goToUsers();
  };

  return (
    <MainPage title="Add User" desc="Create a new user account">
      <UserForm
        initialValue={EMPTY_FORM}
        mode="create"
        onCancel={goToUsers}
        onSubmit={handleSubmit}
      />
    </MainPage>
  );
}
