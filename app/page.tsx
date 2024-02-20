"use client";
import Success from "../components/Success";
import { signUpAction } from "../redux/actions/action";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import validator from "validator";

const rowSpan: string[] = ['row-span-1', 'row-span-2', 'row-span-3'];

interface Country {
  idd: {
    code: string;
    root: string;
    suffixes: string;
  };
  name: {
    common: string;
  };
  flags: {
    png: string;
  };
  cca2: string;
}

export default function Home() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    // Fetch list of countries from the API
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data: Country[] = await response.json();
        // Modify the country codes to include both root and suffixes
        const modifiedCountries = data.map(country => ({
          ...country,
          idd: {
            ...country.idd,
            code: country.idd.root + country.idd.suffixes
          }
        }));
        setCountries(modifiedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const [data, setData] = useState({
    name: "",
    code: "+1",
    phone: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<any>({});
  const [validationSuccess, setValidationSuccess] = useState<any>({
    popUp: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setData({ ...data, [e.target.name]: e.target.value });

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountryCode = e.target.value;
    setData({ ...data, code: selectedCountryCode });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let { name, email, password, phone, code } = data;
    name = name.trim();
    email = email.trim().toLowerCase();

    if (!validator.isEmail(email)) {
      return setError({ email: 'Invalid email' })
    }
    else if (!validator.isLength(name, { min: 3 })) {
      return setError({ name: 'Name must be greater than 3 characters' })
    }
    else if (!validator.isMobilePhone(phone) || phone.length < 9 || phone.length > 11) {
      return setError({ phone: 'Invalid phone number' })
    }
    else if ((password.length < 6)) {
      return setError({ password: 'Password must be greater than 6 characters' })
    }
    else if (!validator.isStrongPassword(password)) {
      return setError({ password: 'Please enter a strong password' })
    }
    else {
      let formData = {
        name,
        email,
        password,
        phone: code + phone
      }

      setValidationSuccess({
        popUp: true,
        onClose: () => setValidationSuccess(false),
        onAction: () => dispatch(signUpAction(formData))
      });
    }
  }

  return (
    <>
      {validationSuccess.popUp ? <Success onAction={validationSuccess.onAction} onClose={validationSuccess.onClose} /> : <></>}
      <main className="grid grid-cols-1 md:grid-cols-2 w-full h-screen">
        <div className="p-10 flex flex-col justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM6.262 6.072a8.25 8.25 0 1 0 10.562-.766 4.5 4.5 0 0 1-1.318 1.357L14.25 7.5l.165.33a.809.809 0 0 1-1.086 1.085l-.604-.302a1.125 1.125 0 0 0-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 0 1-2.288 4.04l-.723.724a1.125 1.125 0 0 1-1.298.21l-.153-.076a1.125 1.125 0 0 1-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 0 1-.21-1.298L9.75 12l-1.64-1.64a6 6 0 0 1-1.676-3.257l-.172-1.03Z" clipRule="evenodd" />
            </svg>
            <select className="outline-none cursor-pointer font-light">
              <option value="eng">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <Image src={'/images/logo.png'} width={260} height={40} alt="logo" objectFit="contain" />
            </div>
            <h1 className="font-medium text-2xl 2xl:text-3xl mt-10 mb-6">Sign Up</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-4">
              <div className="w-full">
                <input name="name" value={data.name} onChange={handleChange} type="text" placeholder="Full Name" className="bg-[#D9D9D94D] placeholder:text-[#11111166] rounded-md outline-none border-none py-2 px-4 w-full" />
                {error?.name ? <p className="text-xs text-red-500">{error?.name}</p> : ''}
              </div>
              <div className="w-full bg-[#D9D9D94D] flex items-center gap-1 px-2 rounded-md">
                {data.code && countries.find(country => country.idd && country.idd.code === data.code) && (
                  <img
                  src={countries.find(country => country.idd && country.idd.code === data.code)?.flags.png}
                  alt={countries.find(country => country.idd && country.idd.code === data.code)?.name.common}
                  style={{ width: '30px' }}
                />
                )}
                <select
                  name="code"
                  value={data.code}
                  onChange={handleCountryChange}
                  className="outline-none w-5 bg-transparent overflow-hidden"
                >
                  {countries
                    .map((country) => (
                      <option key={country.cca2} value={country.idd && country.idd.code}>
                        {country.name && country.name.common}
                      </option>
                    ))}
                </select>
                <span className="text-[#11111166]">
                  {
                    countries.find((country) => country.idd && country.idd.code === data.code) &&
                    countries.find((country) => country.idd && country.idd.code === data.code)?.idd?.code
                  }
                </span>
                <input name="phone" value={data.phone} onChange={handleChange} type="number" placeholder="" className="placeholder:text-[#11111166] bg-transparent rounded-md outline-none border-none py-2 w-full" />
              </div>
              <div className="w-full">
                <input type="email" name="email" value={data.email} onChange={handleChange} placeholder="email" className="bg-[#D9D9D94D] placeholder:text-[#11111166] rounded-md outline-none border-none py-2 px-4 w-full" />
                {error?.email ? <p className="text-xs text-red-500">{error?.email}</p> : ''}
              </div>
              <div className="w-full relative">
                <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer absolute top-1/2 right-3 transform -translate-y-1/2 text-[#11111166]">
                  {showPassword
                    ?
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  }
                </span>
                <input type={showPassword ? "text" : "password"} name="password" value={data.password} onChange={handleChange} placeholder="Password" className="bg-[#D9D9D94D] placeholder:text-[#11111166] rounded-md outline-none border-none py-2 px-4 w-full" />
                {error?.password ? <p className="text-xs text-red-500">{error?.password}</p> : ''}
              </div>
              <button type="submit" className="bg-black text-white py-2 w-full text-lg rounded-lg mt-3 mb-1">Create Account</button>
              <p className="text-[#333333] font-light text-center">Already have an Account <span className="text-black font-normal">Login</span></p>
            </form>
          </div>

          <div>
            <p className="text-[#333333] font-light text-center">By signing up you agree to our <br className="sm:hidden" /> <span className="text-black font-normal">Terms & Conditions</span></p>
          </div>

        </div>

        <div className="bg-[#111111] text-white px-10 pb-0 justify-center hidden md:flex h-screen">
          <div className="w-full max-w-xl flex flex-col">
            <div className="sticky top-0 z-10 bg-[#111111] pt-20">
              <h1 className="text-2xl">Millions of Product Ready to Dropship</h1>
              <p className="font-light lg:text-lg my-2">Millions of Product Ready to Dropship. Millions of Product Ready to Dropship. Millions of Product Ready to Dropship. </p>
              <div className="flex items-center gap-3 my-8">
                {
                  [1, 2, 3].map((el) => <div key={el} className="w-3 h-3 rounded-full bg-[#333333]"></div>)
                }
              </div>
            </div>
            <div className="flex-grow overflow-y-auto scroll-hidden rounded-xl ">
              <div className="grid grid-cols-3 gap-4 h-[150dvh] lg:h-[200dvh] pb-10">
                {
                  Array(20).fill(1).map((_, i) => <div key={i} className={"bg-white rounded-xl " + (rowSpan[Math.floor(Math.random() * 10) % 2]) + " " + (Math.floor(Math.random() * 10) % 2 === 0 ? 'bg-white' : 'bg-[#D9D9D9]')}></div>)
                }
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
