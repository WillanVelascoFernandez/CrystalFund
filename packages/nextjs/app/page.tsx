"use client";

import type { NextPage } from "next";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useState } from "react";
import { IntegerInput } from "~~/components/scaffold-eth";
import { getTokenPrice, multiplyTo1e18 } from "~~/utils/scaffold-eth/priceInWei";

const Home: NextPage = () => {
  const [ donacion, setDonacion] = useState<string | bigint>("");
  const [ id, setId] = useState(BigInt(0));
  const { writeContractAsync: contratoWrite } = useScaffoldWriteContract("CrystalFund");

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Contribuir</h2>
            <div className="text-xl">Id Project</div>

            <div className="w-full flex flex-col space-y-2">
            <IntegerInput
              placeholder="amount of tokens to buy"
              value={id!.toString()}
              onChange={value => setId(BigInt(value))}
              disableMultiplyBy1e18
              />
            </div>
            <div className="text-xl">Donacion</div>

            <div className="w-full flex flex-col space-y-2">
            <IntegerInput
              placeholder="amount of tokens to buy"
              value={donacion.toString()}
              onChange={value => setDonacion(value)}
              disableMultiplyBy1e18
            />
          </div>

          <button
            className="btn btn-secondary mt-2"
            onClick={async () => {
              try {
                await contratoWrite({
                  functionName: "contribute", value: getTokenPrice(donacion),
                  args: [ id ]
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