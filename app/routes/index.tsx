import { Link } from "react-router";

const pageTitle = "D&D Character Sheets";

export function meta() {
  return [{ title: pageTitle }];
}

export default function HomePage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div style={{ width: "300px" }}>
        <table>
          <tbody>
            <tr>
              <th>Characters</th>
            </tr>
            <tr>
              <td>
                <Link to="/characters">My Characters</Link>
              </td>
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <th>Critical Role</th>
            </tr>
            <tr>
              <td>
                <Link to="/critical-role">Critical Role Characters</Link>
              </td>
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <th>Classes</th>
            </tr>
            <tr>
              <td>
                <Link to="/classes">All Classes</Link>
              </td>
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <th>Reference</th>
            </tr>
            <tr>
              <td>
                <Link to="/general-info">General Info</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
