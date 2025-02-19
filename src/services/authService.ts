import agentData from '../data/agent.json';

export interface Agent {
  username: string;
  password: string;
}

export const loginAgent = (username: string, password: string): Promise<Agent | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === agentData.username && password === agentData.password) {
        resolve(agentData as Agent);
      } else {
        resolve(null);
      }
    }, 500);
  });
};
