import { getFinishedTodos } from "../../graphql/resolvers/queries/getTodo";
import { TodoModel } from "../../graphql/schemas";

jest.mock("../../graphql/schemas", () => ({
  TodoModel: {
    find: jest.fn(),
  },
}));

describe("getFinishedTodos", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all completed todos successfully", async () => {
    const mockCompletedTodos = [
      { id: "1", title: "Task 1", completed: true },
      { id: "2", title: "Task 2", completed: true },
      { id: "3", title: "Task 3", completed: true },
    ];

    (TodoModel.find as jest.Mock).mockResolvedValue(mockCompletedTodos);

    const result = await getFinishedTodos();

    expect(TodoModel.find).toHaveBeenCalledWith({ completed: true });
    expect(TodoModel.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockCompletedTodos);
  });

  it("should return empty array when no completed todos exist", async () => {
    (TodoModel.find as jest.Mock).mockResolvedValue([]);

    const result = await getFinishedTodos();

    expect(TodoModel.find).toHaveBeenCalledWith({ completed: true });
    expect(result).toEqual([]);
  });

  it("should throw an error if fetching fails", async () => {
    (TodoModel.find as jest.Mock).mockRejectedValue(new Error("DB error"));

    await expect(getFinishedTodos()).rejects.toThrow("Failed to fetch finished todos");
  });

  it("should handle database connection errors", async () => {
    (TodoModel.find as jest.Mock).mockRejectedValue(
      new Error("Database connection failed")
    );

    await expect(getFinishedTodos()).rejects.toThrow("Failed to fetch finished todos");
  });
}); 