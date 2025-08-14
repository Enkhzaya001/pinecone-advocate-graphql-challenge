// get-todo.spec.ts
import { getTodo } from "../../graphql/resolvers/queries/getTodo";
import { TodoModel } from "../../graphql/schemas";

jest.mock("../../graphql/schemas", () => ({
  TodoModel: {
    find: jest.fn(),
  },
}));

describe("getTodo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all todos successfully", async () => {
    const mockTodos = [
      { id: "1", title: "Task 1", completed: false },
      { id: "2", title: "Task 2", completed: true },
    ];

    (TodoModel.find as jest.Mock).mockResolvedValue(mockTodos);

    const result = await getTodo();

    expect(TodoModel.find).toHaveBeenCalledTimes(1);
    expect(TodoModel.find).toHaveBeenCalledWith();
    expect(result).toEqual(mockTodos);
  });

  it("should return empty array when no todos exist", async () => {
    (TodoModel.find as jest.Mock).mockResolvedValue([]);

    const result = await getTodo();

    expect(TodoModel.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it("should throw an error if fetching fails", async () => {
    (TodoModel.find as jest.Mock).mockRejectedValue(new Error("DB error"));

    await expect(getTodo()).rejects.toThrow("Failed to fetch todos");
  });

  it("should handle database connection errors", async () => {
    (TodoModel.find as jest.Mock).mockRejectedValue(
      new Error("Database connection failed")
    );

    await expect(getTodo()).rejects.toThrow("Failed to fetch todos");
  });

  it("should handle network timeout errors", async () => {
    (TodoModel.find as jest.Mock).mockRejectedValue(
      new Error("Network timeout")
    );

    await expect(getTodo()).rejects.toThrow("Failed to fetch todos");
  });
});
