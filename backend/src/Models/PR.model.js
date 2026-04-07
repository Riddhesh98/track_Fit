import mongoose from "mongoose";

const PRSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    name:{
        type:String,
        required:true
    },
    weight:{
        type:Number,
        required:true
    },
    reps:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        required:true
    }

},{
    timestamps:true
}

)

//no multiple PRs for same exercise on same day
PRSchema.index({user:1,name:1,date:1},{unique:true});

const PR = mongoose.model("PR", PRSchema);

export default PR;