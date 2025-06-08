import { useAuth } from "./useAuth";

export const useHasPermission = (permissoesRequeridas) => {
  const { user } = useAuth();

  if (!user || !user.permissoes) {
    return false;
  }

  return permissoesRequeridas.some(p => user.permissoes.includes(p));
};