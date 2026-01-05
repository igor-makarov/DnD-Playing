import { Link } from "react-router";

const pageTitle = "General Info";

export function meta() {
  return [{ title: pageTitle }];
}

export default function GeneralInfoIndexPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div style={{ width: "300px" }}>
        <table>
          <tbody>
            <tr>
              <th>Reference Guides</th>
            </tr>
            <tr>
              <td>
                <Link to="/general-info/scaling-abilities">Scaling Abilities (XPHB 2024)</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
