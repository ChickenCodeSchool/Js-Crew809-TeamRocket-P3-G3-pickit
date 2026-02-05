import type { Result } from "../../../database/client";
import databaseClient from "../../../database/client";

type report = {
  reported_user_id: number | null;
  reported_message_id: number | null;
  reported_announce_id: number | null;
  reporter_id: number;
  description: string;
  creation_date: number;
  status: string;
  cause: string;
};
class reportRepository {
  async create(reports: report) {
    const [result] = await databaseClient.query<Result>(
      "insert into reports (reporter_id, description, creation_date, cause, status, reported_user_id, reported_message_id, reported_announce_id) values (?,?,NOW(),?,?,?,?,?)",
      [
        reports.reporter_id,
        reports.description,
        reports.cause,
        reports.status,
        reports.reported_user_id,
        reports.reported_message_id,
        reports.reported_announce_id,
      ],
    );
    return result;
  }
}
export default new reportRepository();
