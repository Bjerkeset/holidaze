import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterForm from "../forms/register-form";
import LoginForm from "../forms/login-form";

export default async function AuthTabs() {
  return (
    <div>
      <Tabs
        defaultValue="sign-in"
        className="mt-[10vh] flex flex-col items-center"
      >
        <TabsList className="w-full ">
          <TabsTrigger className="w-full" value="sign-in">
            Sign in
          </TabsTrigger>
          <TabsTrigger className="w-full" value="register">
            Register
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sign-in">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
      <div></div>
    </div>
  );
}
