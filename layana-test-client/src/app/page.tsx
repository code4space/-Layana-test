"use client"
import Loading from "@/components/loading";
import Navigation from "@/components/navigation";
import { getUser } from "@/store/actions/fetchUser";
import { UserState } from "@/store/reducers/user";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const user: any = useSelector((state: UserState) => state.UserReducer.user);
  const [quotes, setQuotes] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(getUser());
      const res = await axios.get("https://type.fit/api/quotes");
      const random = Math.floor(Math.random() * res.data.length)
      setQuotes(res.data[random].text);
    };

    fetchData();
  }, [dispatch]);

  if (!quotes) return <Loading />
  return (
    <Navigation>
      <main className="introduction">
        <h1>Hello {user.name}</h1>
        <i>&quot;{quotes}&quot;</i>
      </main>
    </Navigation>
  );
}
