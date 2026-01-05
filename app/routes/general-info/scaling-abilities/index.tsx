import { Link } from "react-router";

const pageTitle = "Scaling Abilities - XPHB 2024";

export function meta() {
  return [{ title: pageTitle }];
}

export default function ScalingAbilitiesIndexPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div style={{ width: "300px" }}>
        <table>
          <tbody>
            <tr>
              <th>Scaling Abilities (XPHB 2024)</th>
            </tr>
            <tr>
              <td>
                <Link to="/general-info/scaling-abilities/proficiency-bonus">Proficiency Bonus</Link>
              </td>
            </tr>
            <tr>
              <td>
                <Link to="/general-info/scaling-abilities/ability-modifiers">Ability Modifiers</Link>
              </td>
            </tr>
            <tr>
              <td>
                <Link to="/general-info/scaling-abilities/save-dcs">Save DCs</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
