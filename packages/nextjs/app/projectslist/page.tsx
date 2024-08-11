"use client";

import { HumanizeDurationLanguage, HumanizeDuration } from 'humanize-duration-ts';
import type { NextPage } from "next";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const ProjectEvents: NextPage = () => {
  const languageUtil = new HumanizeDurationLanguage();
  const humanizer = new HumanizeDuration(languageUtil);
  // ProjectCreated Events
  const { data: projectCreatedEvents, isLoading: isProjectEventsLoading } = useScaffoldEventHistory({
    contractName: "CrystalFund", // Cambia "YourContract" por el nombre real de tu contrato
    eventName: "ProjectCreated",
    fromBlock: 0n,
  });
  function formatTimeRemaining(deadline: bigint) {
    const now = Date.now(); // Tiempo actual en milisegundos
    const timeRemaining = Number(deadline) * 1000 - now; // Tiempo faltante en milisegundos

    // Si el tiempo restante es negativo, significa que el deadline ya pasó
    if (timeRemaining <= 0) {
      return "Expired";
    }

    return humanizer.humanize(timeRemaining, { largest: 2, round: true });
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div>
        <div className="text-center mb-4">
          <span className="block text-2xl font-bold">Project Created Events</span>
        </div>
        {isProjectEventsLoading ? (
          <div className="flex justify-center items-center mt-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-lg">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="bg-primary">Project ID</th>
                  <th className="bg-primary">Creator</th>
                  <th className="bg-primary">Causa</th>
                  <th className="bg-primary">Goal (ETH)</th>
                  <th className="bg-primary">Deadline (Timestamp)</th>
                </tr>
              </thead>
              <tbody>
                {!projectCreatedEvents || projectCreatedEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No events found
                    </td>
                  </tr>
                ) : (
                  projectCreatedEvents?.map((event, index) => {
                    return (
                      <tr key={index}>
                        <td>{event!.args!.projectId!.toString()}</td>
                        <td className="text-center">
                          <Address address={event.args.creator} />
                        </td>
                        <td>{event.args.causa}</td>
                        <td>{formatEther(event.args?.goal || 0n)}</td>
                        <td>{event?.args?.deadline ? formatTimeRemaining(event.args.deadline) : "No deadline"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectEvents;
