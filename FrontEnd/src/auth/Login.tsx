
// We created of login page where user can login then enter into home page. we will add zod where user can insert that data which is given example name->string password->string contact->string other type of data will not required.

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import { Loader2, Mail } from 'lucide-react';
import { LockKeyhole } from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [input, setInput] = useState<LoginInputState>({
        email: "",
        password: "",
    })

    const navigate = useNavigate();

    const { login, loading } = useUserStore();

    const [errors, setErrors] = useState<Partial<LoginInputState>>({})

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value })
    }

    const loginSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();
        const result = userLoginSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<LoginInputState>);
            return;
        }
        console.log(input);
        try {
            await login(input);
            navigate("/");
        } catch (error: any) {
            console.log(error.message);
        }
    }

    return (
        <>
            <div className="flex items-center justify-center min-h-screen ">
                <form onSubmit={loginSubmitHandler} className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4">
                    <div className="mb-4">
                        <h1 className="font-bold text-2xl">Joseph Restaurant</h1>
                    </div>
                    <div className="mb-4">
                        <div className="relative">
                            {/* <Label>Email</Label> */}
                            <Input type="email" placeholder="Email" name="email" value={input.email} onChange={changeEventHandler} className="pl-10 focus-visible:ring-1" />
                            <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                            {
                                errors && <span className="text-sm text-red-500">{errors.email}</span>
                            }
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="relative">
                            {/* <Label>Password</Label> */}
                            <Input type="password" placeholder="Password" name="password" value={input.password} onChange={changeEventHandler} className="pl-10 focus-visible:ring-1" />
                            <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                            {
                                errors && <span className="text-sm text-red-500">{errors.email}</span>
                            }
                        </div>
                    </div>
                    <div className="mb-10">
                        {
                            loading ? (<Button disabled className="w-full bg-orange  hover:bg-hoverOrange"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait</Button>) : (<Button className="w-full  bg-orange hover:bg-hoverOrange" type="submit">Login</Button>)
                        }
                        <div className="mt-4 text-center">
                            <Link to="/forgot-password" className="hover:text-blue-500 hover:underline">Forgot Password</Link>
                        </div>
                    </div>
                    <Separator />
                    <p className="mt-2 text-center">
                        Don't have an account?{" "}<Link className="text-blue-500" to="/signup">Signup</Link>
                    </p>
                </form>
            </div>
        </>
    )
}

export default Login