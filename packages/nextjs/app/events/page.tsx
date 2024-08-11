"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { EtherInput, InputBase, IntegerInput } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [causa, setCausa] = useState("");
  const [goal, setGoal] = useState(BigInt(0));
  const [duration, setDuration] = useState(BigInt(0));

  const { writeContractAsync: createProject } = useScaffoldWriteContract("CrystalFund");

  const createProjectNew = async () => {
    try {
      await createProject({
        functionName: "createProject",
        args: [causa, goal, duration],
      });
    } catch (e) {
      console.error("Error setting greeting:", e);
    }
  };
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Crear Proyecto</h2>
            <div className="text-xl">Causa</div>
            <InputBase name="causa" placeholder="causa" value={causa} onChange={nombre => setCausa(nombre)} />

            <div className="text-xl">Meta</div>

            <EtherInput value={goal!.toString()} onChange={amount => (amount == "" ? "" : setGoal(BigInt(amount)))} />

            <div className="text-xl">Dias de duración</div>
            <IntegerInput
              value={duration.toString()}
              onChange={updateDuration => {
                setDuration(BigInt(updateDuration));
              }}
              placeholder="value (wei)"
            />

            <button className="btn btn-secondary mt-2" onClick={() => createProjectNew()}>
              Donate
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
