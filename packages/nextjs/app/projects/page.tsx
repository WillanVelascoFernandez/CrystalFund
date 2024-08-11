"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { EtherInput, InputBase, IntegerInput } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { getTokenPrice } from "~~/utils/scaffold-eth/priceInWei";

const Home: NextPage = () => {
  // Contribuir
  const [causa, setCausa] = useState("");
  const [goal, setGoal] = useState(BigInt(0));
  const [duration, setDuration] = useState(BigInt(0));
  // Withdraw
  const [id, setId] = useState(BigInt(0));

  const { writeContractAsync: contratoWrite } = useScaffoldWriteContract("CrystalFund");

  const createProjectNew = async () => {
    try {
      await contratoWrite({
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

            <EtherInput
              value={goal.toString()}
              onChange={amount => {
                debugger;
                // Verificar si la cadena es vacía
                if (amount === "") {
                  setGoal(BigInt(0)); // O el valor que consideres adecuado para una entrada vacía
                  return;
                }

                // Intentar convertir la cadena a un número
                const numberAmount = Number(amount);

                // Verificar si la conversión a número es válida
                if (isNaN(numberAmount)) {
                  console.error("Invalid number:", amount);
                  // Puedes optar por no actualizar el estado o manejar el error de otra manera
                  return;
                }

                // Convertir el número a bigint y actualizar el estado
                setGoal(BigInt(Math.round(parseFloat(amount))));
              }}
            />
            <div className="text-xl">Dias de duración</div>
            <IntegerInput
              value={duration.toString()}
              onChange={updateDuration => {
                setDuration(BigInt(updateDuration));
              }}
              placeholder="value (wei)"
            />

            <button className="btn btn-secondary mt-2" onClick={() => createProjectNew()}>
              Crear
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Retirar</h2>
            <div className="text-xl">Id Project</div>

            <div className="w-full flex flex-col space-y-2">
              <IntegerInput
                placeholder="amount of tokens to buy"
                value={id!.toString()}
                onChange={value => setId(BigInt(value))}
                disableMultiplyBy1e18
              />
            </div>

            <button
              className="btn btn-secondary mt-2"
              onClick={async () => {
                try {
                  await contratoWrite({
                    functionName: "withdrawFunds",
                    args: [id],
                  });
                } catch (err) {
                  console.error("Error calling buyTokens function");
                }
              }}
            >
              Donar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
