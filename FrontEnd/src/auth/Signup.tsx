
// We created of sign page where user can signup then enter into home page. we will add zod where user can insert that data which is given example name->string password->string contact->string other type of data will not required.

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import { Loader2, Mail, SquareUserRound, User } from 'lucide-react';
import { LockKeyhole } from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import { SignupInputState, userSignupSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";


const Signup = () => {

  const [input, setInput] = useState<SignupInputState>({
    fullname: "",
    email: "",
    password: "",
    contact: ""
    // partial error some field has no error some has error.
  })

  const {signup, loading} = useUserStore();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<Partial<SignupInputState>>({})

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value })
  }

  const loginSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    // form validation check start
    const result = userSignupSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<SignupInputState>);
      return;
    }
    try {
      await signup(input);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
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
              <Input type="text" placeholder="FullName" name="fullname" value={input.fullname} onChange={changeEventHandler} className="pl-10 focus-visible:ring-1" />
              <User className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
              {
                errors && <span className="text-sm text-red-500">{errors.fullname}</span>
              }
            </div>
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
                errors && <span className="text-sm text-red-500">{errors.password}</span>
              }
            </div>
          </div>
          <div className="mb-4">
            <div className="relative">
              {/* <Label>Email</Label> */}
              <Input type="text" placeholder="Contact No" name="contact" value={input.contact} onChange={changeEventHandler} className="pl-10 focus-visible:ring-1" />
              <SquareUserRound className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
              {
                errors && <span className="text-sm text-red-500">{errors.contact}</span>
              }
            </div>
          </div>
          <div className="mb-10">
            {loading ? (
              <Button disabled className="w-full bg-orange hover:bg-hoverOrange">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full bg-orange hover:bg-hoverOrange">
                Signup
              </Button>
            )}
          </div>
          <Separator />
          <p className="mt-2 text-center">
            Already have an account?{" "}<Link className="text-blue-500" to="/login">Login</Link>
          </p>
        </form>
      </div>
    </>
  )
}

export default Signup;