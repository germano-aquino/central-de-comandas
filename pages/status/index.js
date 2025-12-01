import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function Status() {
  return (
    <>
      <h1>Status</h1>
      <StatusInfo />
    </>
  );
}

function StatusInfo() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
    dedupingInterval: 2000,
  });

  let updatedAt = "Carregando...";
  let database = "Carregando...";

  if (!isLoading) {
    updatedAt = data.updated_at;
    database = data.dependencies.database;
  }
  return (
    <div>
      <p>
        Última Atualização: <b>{new Date(updatedAt).toLocaleString("Pt-br")}</b>
      </p>
      <p>
        Banco de Dados:
        <ul>
          <li>
            Versão: <b>{database.version}</b>
          </li>
          <li>
            Conexões Abertas: <b>{database.opened_connections}</b>
          </li>
          <li>
            Conexões Máximas: <b>{database.max_connections}</b>
          </li>
        </ul>
      </p>
    </div>
  );
}

export default Status;
