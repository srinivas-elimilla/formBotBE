const Responses = require("../models/Responses");
const User = require("../models/User");

// submit form by formId
const submitForm = async (req, res) => {
  const { userId, folderIndex, formId, elements, views, starts, completed } =
    req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const response = await Responses.findById(formId);
    if (!response) {
      const newResponse = new Responses({
        answers: elements,
        views,
        starts,
        completed,
      });

      await newResponse.save();
      return res.status(200).json({
        message: "Form Submitted successfully",
        newResponse,
      });
    } else {
      (response.answers = elements),
        (response.views = +views),
        (response.starts = +starts),
        (response.completed = +completed),
        await response.save();

      return res.status(200).json({
        message: "Form Submitted successfully",
        response: {
          elements: response.elements,
          views: response.views,
          starts: response.starts,
          completed: response.completed,
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = { submitForm };
