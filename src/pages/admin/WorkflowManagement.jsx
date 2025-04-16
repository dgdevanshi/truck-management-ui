"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getWorkflows,
  getCheckpoints,
  createWorkflow,
  createCheckpoint,
  updateWorkflow,
  updateCheckpoint,
  reset,
} from "../../features/workflows/workflowSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import ResponsiveTable from "../../components/ResponsiveTable";

const WorkflowManagement = () => {
  const dispatch = useDispatch();
  const { workflows, checkpoints, isLoading, isSuccess, isError, message } =
    useSelector((state) => state.workflows);

  const [activeTab, setActiveTab] = useState("workflows");
  const [showWorkflowForm, setShowWorkflowForm] = useState(false);
  const [showCheckpointForm, setShowCheckpointForm] = useState(false);
  const [showEditWorkflowForm, setShowEditWorkflowForm] = useState(false);
  const [showEditCheckpointForm, setShowEditCheckpointForm] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [editingCheckpoint, setEditingCheckpoint] = useState(null);

  const [workflowForm, setWorkflowForm] = useState({
    name: "",
    description: "",
  });

  const [checkpointForm, setCheckpointForm] = useState({
    name: "",
    description: "",
    workflowId: "",
    position: 1,
  });

  const [editWorkflowForm, setEditWorkflowForm] = useState({
    name: "",
    description: "",
  });

  const [editCheckpointForm, setEditCheckpointForm] = useState({
    name: "",
    description: "",
    workflowId: "",
    position: 1,
  });

  // Add a state variable to track operations
  const [operationType, setOperationType] = useState(null);

  useEffect(() => {
    // Fetch workflows and checkpoints when component mounts
    dispatch(getWorkflows());
    dispatch(getCheckpoints());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // Show success/error messages
  useEffect(() => {
    if (isSuccess && operationType) {
      toast.success("Operation completed successfully!");
      setOperationType(null);
      dispatch(reset());
    }

    if (isError) {
      toast.error(message || "An error occurred");
      setOperationType(null);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch, operationType]);

  const handleWorkflowChange = (e) => {
    const { name, value } = e.target;
    setWorkflowForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckpointChange = (e) => {
    const { name, value } = e.target;
    setCheckpointForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditWorkflowChange = (e) => {
    const { name, value } = e.target;
    setEditWorkflowForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditCheckpointChange = (e) => {
    const { name, value } = e.target;
    setEditCheckpointForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkflowSubmit = (e) => {
    e.preventDefault();
    setOperationType("create");
    dispatch(createWorkflow(workflowForm));
    setWorkflowForm({ name: "", description: "" });
    setShowWorkflowForm(false);
  };

  const handleCheckpointSubmit = (e) => {
    e.preventDefault();
    setOperationType("create");
    dispatch(createCheckpoint(checkpointForm));
    setCheckpointForm({
      name: "",
      description: "",
      workflowId: "",
      position: 1,
    });
    setShowCheckpointForm(false);
  };

  const handleEditWorkflow = (workflow) => {
    setEditingWorkflow(workflow);
    setEditWorkflowForm({
      name: workflow.name,
      description: workflow.description,
    });
    setShowEditWorkflowForm(true);
  };

  const handleEditCheckpoint = (checkpoint) => {
    setEditingCheckpoint(checkpoint);
    setEditCheckpointForm({
      name: checkpoint.name,
      description: checkpoint.description,
      workflowId: checkpoint.workflowId,
      position: checkpoint.position,
    });
    setShowEditCheckpointForm(true);
  };

  const handleEditWorkflowSubmit = (e) => {
    e.preventDefault();
    setOperationType("update");
    dispatch(
      updateWorkflow({
        workflowId: editingWorkflow.id,
        workflowData: editWorkflowForm,
      })
    );
    setShowEditWorkflowForm(false);
  };

  const handleEditCheckpointSubmit = (e) => {
    e.preventDefault();
    setOperationType("update");
    dispatch(
      updateCheckpoint({
        checkpointId: editingCheckpoint.id,
        checkpointData: editCheckpointForm,
      })
    );
    setShowEditCheckpointForm(false);
  };

  // Get workflow name by ID
  const getWorkflowName = (workflowId) => {
    if (!workflowId) return "None";
    const workflow = workflows.find(
      (w) => w.id === Number.parseInt(workflowId)
    );
    return workflow ? workflow.name : workflowId;
  };

  // Table headers for workflows
  const workflowHeaders = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    {
      key: "actions",
      label: "Actions",
      render: (workflow) => (
        <button
          onClick={() => handleEditWorkflow(workflow)}
          className="rounded-md bg-teal-100 p-1 text-teal-800 hover:bg-teal-200"
          title="Edit workflow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
      ),
    },
  ];

  // Table headers for checkpoints
  const checkpointHeaders = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    {
      key: "workflowId",
      label: "Workflow",
      render: (checkpoint) => getWorkflowName(checkpoint.workflowId),
    },
    { key: "position", label: "Position" },
    {
      key: "actions",
      label: "Actions",
      render: (checkpoint) => (
        <button
          onClick={() => handleEditCheckpoint(checkpoint)}
          className="rounded-md bg-teal-100 p-1 text-teal-800 hover:bg-teal-200"
          title="Edit checkpoint"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
      ),
    },
  ];

  // Use real data if available, otherwise use empty arrays
  const displayWorkflows = workflows || [];
  const displayCheckpoints = checkpoints || [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Workflow Management
      </h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 overflow-x-auto">
        <ul className="flex flex-wrap -mb-px whitespace-nowrap">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("workflows")}
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "workflows"
                  ? "text-teal-600 border-teal-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              Workflows
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("checkpoints")}
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "checkpoints"
                  ? "text-teal-600 border-teal-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              Checkpoints
            </button>
          </li>
        </ul>
      </div>

      {/* Workflows Tab */}
      {activeTab === "workflows" && (
        <div className="rounded-lg bg-white p-4 md:p-6 shadow-sm">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Workflows</h2>
            <button
              onClick={() => setShowWorkflowForm(true)}
              className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 w-full sm:w-auto"
            >
              Add Workflow
            </button>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <ResponsiveTable
              headers={workflowHeaders}
              data={displayWorkflows}
              renderRow={(workflow, index, viewType) => {
                if (viewType === "table") {
                  return (
                    <tr key={workflow.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {workflow.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {workflow.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {workflow.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <button
                          onClick={() => handleEditWorkflow(workflow)}
                          className="rounded-md bg-teal-100 p-1 text-teal-800 hover:bg-teal-200"
                          title="Edit workflow"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                }
              }}
              emptyMessage="No workflows found"
            />
          )}

          {/* Add Workflow Form */}
          {showWorkflowForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="w-full max-w-md rounded-lg bg-white p-4 md:p-6 shadow-lg max-h-[90vh] overflow-y-auto">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                  Add Workflow
                </h2>
                <form onSubmit={handleWorkflowSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={workflowForm.name}
                      onChange={handleWorkflowChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={workflowForm.description}
                      onChange={handleWorkflowChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowWorkflowForm(false)}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto mb-2 sm:mb-0"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 w-full sm:w-auto"
                    >
                      Add Workflow
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Workflow Form */}
          {showEditWorkflowForm && editingWorkflow && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="w-full max-w-md rounded-lg bg-white p-4 md:p-6 shadow-lg max-h-[90vh] overflow-y-auto">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                  Edit Workflow
                </h2>
                <form onSubmit={handleEditWorkflowSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="edit-name"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="edit-name"
                      name="name"
                      value={editWorkflowForm.name}
                      onChange={handleEditWorkflowChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="edit-description"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="edit-description"
                      name="description"
                      value={editWorkflowForm.description}
                      onChange={handleEditWorkflowChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEditWorkflowForm(false)}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto mb-2 sm:mb-0"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 w-full sm:w-auto"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Checkpoints Tab */}
      {activeTab === "checkpoints" && (
        <div className="rounded-lg bg-white p-4 md:p-6 shadow-sm">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Checkpoints</h2>
            <button
              onClick={() => setShowCheckpointForm(true)}
              className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 w-full sm:w-auto"
            >
              Add Checkpoint
            </button>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <ResponsiveTable
              headers={checkpointHeaders}
              data={displayCheckpoints}
              renderRow={(checkpoint, index, viewType) => {
                if (viewType === "table") {
                  return (
                    <tr key={checkpoint.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {checkpoint.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {checkpoint.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {checkpoint.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getWorkflowName(checkpoint.workflowId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {checkpoint.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <button
                          onClick={() => handleEditCheckpoint(checkpoint)}
                          className="rounded-md bg-teal-100 p-1 text-teal-800 hover:bg-teal-200"
                          title="Edit checkpoint"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                }
              }}
              emptyMessage="No checkpoints found"
            />
          )}

          {/* Add Checkpoint Form */}
          {showCheckpointForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="w-full max-w-md rounded-lg bg-white p-4 md:p-6 shadow-lg max-h-[90vh] overflow-y-auto">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                  Add Checkpoint
                </h2>
                <form onSubmit={handleCheckpointSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={checkpointForm.name}
                      onChange={handleCheckpointChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={checkpointForm.description}
                      onChange={handleCheckpointChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      rows="2"
                      required
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="workflowId"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Workflow
                    </label>
                    <select
                      id="workflowId"
                      name="workflowId"
                      value={checkpointForm.workflowId}
                      onChange={handleCheckpointChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      required
                    >
                      <option value="">Select a workflow</option>
                      {displayWorkflows.map((workflow) => (
                        <option key={workflow.id} value={workflow.id}>
                          {workflow.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="position"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Position
                    </label>
                    <input
                      type="number"
                      id="position"
                      name="position"
                      value={checkpointForm.position}
                      onChange={handleCheckpointChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      min="1"
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCheckpointForm(false)}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto mb-2 sm:mb-0"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 w-full sm:w-auto"
                    >
                      Add Checkpoint
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Checkpoint Form */}
          {showEditCheckpointForm && editingCheckpoint && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="w-full max-w-md rounded-lg bg-white p-4 md:p-6 shadow-lg max-h-[90vh] overflow-y-auto">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                  Edit Checkpoint
                </h2>
                <form onSubmit={handleEditCheckpointSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="edit-checkpoint-name"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="edit-checkpoint-name"
                      name="name"
                      value={editCheckpointForm.name}
                      onChange={handleEditCheckpointChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="edit-checkpoint-description"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="edit-checkpoint-description"
                      name="description"
                      value={editCheckpointForm.description}
                      onChange={handleEditCheckpointChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      rows="2"
                      required
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="edit-checkpoint-workflowId"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Workflow
                    </label>
                    <select
                      id="edit-checkpoint-workflowId"
                      name="workflowId"
                      value={editCheckpointForm.workflowId}
                      onChange={handleEditCheckpointChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      required
                    >
                      <option value="">Select a workflow</option>
                      {displayWorkflows.map((workflow) => (
                        <option key={workflow.id} value={workflow.id}>
                          {workflow.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="edit-checkpoint-position"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Position
                    </label>
                    <input
                      type="number"
                      id="edit-checkpoint-position"
                      name="position"
                      value={editCheckpointForm.position}
                      onChange={handleEditCheckpointChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      min="1"
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEditCheckpointForm(false)}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto mb-2 sm:mb-0"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 w-full sm:w-auto"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkflowManagement;
