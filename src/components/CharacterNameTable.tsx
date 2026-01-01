import { Link, href } from "react-router";

interface Props {
  name: string;
  infoHref?: Parameters<typeof href>[0];
}

export default function CharacterNameTable({ name, infoHref }: Props) {
  return (
    <table>
      <tbody>
        <tr>
          <th colSpan={2} style={{ textAlign: "center" }}>
            Name
          </th>
        </tr>
        <tr>
          <td colSpan={2} style={{ textAlign: "center" }}>
            {infoHref ? (
              <>
                {name} (
                <Link to={href(infoHref)} target="_blank">
                  build info
                </Link>
                )
              </>
            ) : (
              name
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
