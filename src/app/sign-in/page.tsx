import AuthForm from "@web/app/sign-in/auth-form";
import { AppQueryClientProvider } from "@web/app/_components/providers/app-query-client-provider";

export default function Page() {
  return (
    <>
      <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
        <AppQueryClientProvider>
          <AuthForm />
        </AppQueryClientProvider>
      </div>
      <p className="mt-10 text-center text-sm/6 text-gray-500">
        Отсутвует учетная запись?{" "}
        <a
          href="#"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Обратитесь к нам!
        </a>
      </p>
    </>
  );
}
