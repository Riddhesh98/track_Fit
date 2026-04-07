import PR from "../Models/PR.model.js";
export const createPR = async (req, res) => {
    try {
      const userId = req.user?._id;
      const { name, weight, reps } = req.body;
  
      if (!name || !weight || !reps) {
        return res.status(400).json({
          message: "Name, weight and reps are required"
        });
      }
  
      const date = req.body.date || new Date().toLocaleDateString('en-CA');
  
      const newPR = await PR.findOneAndUpdate(
        { user: userId, name, date },
        { weight, reps },
        { new: true, upsert: true }
      );
  
      return res.status(201).json(newPR);
  
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

  export const editPR = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(req.params);
      console.log(id);
  
      const userId = req.user._id;
  
      if (!id) {
        return res.status(400).json({ message: "PR id is required" });
      }
  
      const { name, weight, reps } = req.body;
  
      if (!name || !weight || !reps) {
        return res.status(400).json({
          message: "Name, weight and reps are required",
        });
      }
  
      // ✅ SAFE DATE HANDLING
      const finalDate =
        req.body.date || new Date().toISOString().split("T")[0];
  
      // ✅ CORRECT QUERY
      const updatedPR = await PR.findOneAndUpdate(
        { _id: id, user: userId },
        { name, weight, reps, date: finalDate },
        { new: true }
      );
  
      if (!updatedPR) {
        return res.status(404).json({ message: "PR not found" });
      }
  
      return res.status(200).json(updatedPR);
  
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

 export const deletePR = async (req,res)=>{
    const {id} = req.params;

    if(!id){
        return res.status(400).json({message:"PR id is required"})
    }

    try {
        const deletedPR = await PR.findByIdAndDelete(id);
        if(!deletedPR){
            return res.status(404).json({message:"PR not found"})
        }
        res.status(200).json({message:"PR deleted successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


export const getAllPRs = async (req,res)=>{
    const userId = req.user._id;
    console.log(userId)
    console.log(req.user)   

    if(!userId){
        return res.status(400).json({message:"User id is required"})
    }

    try {
        const PRs = await PR.find({user:userId});
        res.status(200).json(PRs);
    } catch (error) {
        res.status(500).json({message:error.message})
    }

}


export const getHistoryByExerciseId = async (req,res)=>{
    const {id} = req.params;
  const UserId= req.user._id;

    if(!id){
        return res.status(400).json({message:"Id is required"})
    }
    try {
        const PRs = await PR.find({user:UserId, _id:id});
        res.status(200).json(PRs);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
