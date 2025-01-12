import React, { useContext, useEffect, useState } from "react";
//import { useHistory, useParams, useLocation } from 'react-router-dom';
import AuthContext from "../../AuthContext";
import { G_API } from "../../config";
import { ReactComponent as AssignmentIcon } from "./Assests/Assignment.svg";
import { ReactComponent as MoreIcon } from "./Assests/more.svg";
import { ReactComponent as Line } from "./Assests/Line.svg";
import thumbnail from "../Student/Assests/thumbnail.png";
import bottom from "../Images/Bottom.png";
import Spinner from "../Spinner/Spinner";
import styles from "./TeacherAssignmentPage1.module.css";
import ActivatePeerLearning from "./ActivatePeerLearning";


export default function TeacherAssignmentPage1() {

    const { userData, course, assignment } = useContext(AuthContext);

    const [TeacherName, setTeacherName] = useState([]);
    const [spin, setSpin] = useState(true);
    const [allAssignments, setAllAssignments] = useState([]);
    const [peerAssignments, setPeerAssignments] = useState([]);
    
    const truncate = (str) => {
        if (str) {
          return str.length > 60 ? str.substring(0, 59) + "..." : str;
        }
    }


    const loadData = async () =>{
        if (userData.token) {
          await fetch(`${G_API}/courses/${assignment.courseId}/teachers`, {
              method: "GET",
              headers: {
                  Authorization: `Bearer ${userData.token}`,
              },
          })
              .then((res) => res.json())
              .then((res) => {
                  // console.log(res.teachers);
                  var len = res.teachers.length;
                  for (var i = 0; i < len; i++) {
                      if (res.teachers[i].userId == assignment.creatorUserId) {
                          var g = i;
                      }
                  }
                  setTeacherName(res.teachers[g].profile.name.fullName);
              });

              await fetch(`${G_API}/courses/${course.id}/courseWork`, { //fetch all the assignments from classrooom and store it in assignments using setAllAssignments
                method: "GET",
                headers: {
                  Authorization: `Bearer ${userData.token}`,
                },
              })
                .then((res) => res.json())
                .then((res) => {
                  setAllAssignments(res.courseWork);
                })
  
              setSpin(false);
      
        }
      }
  
      useEffect(() => { loadData() }, [userData.token]);


    function conversion(hours, minutes) {
        var t;
        var h = hours + 5;
        var m = minutes + 30;
        if (m >= 60) {
            h = h + 1;
            m = 60 - m;
        }
        if (m < 10) {
            m = "0" + m;
        }
        if (h >= 24)
            h = h - 24;
        if (h >= 12) {
            t = 'PM';
            if (h > 12)
                h = h - 12;
        }
        else {
            t = 'AM';
            if (h < 10) {
                h = "0" + h;
            }
        }
        return h + ":" + m + " " + t;
    }
    function none(hours) {
        var t;
        var h = hours + 5;
        var m = 30;
        if (h >= 24)
            h = h - 24;
        if (h >= 12) {
            t = 'PM';
            if (h > 12)
                h = h - 12;
        }
        else {
            t = 'AM';
            if (h < 10) {
                h = "0" + h;
            }
        }
        return h + ":" + m + " " + t;
    }
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    console.log(assignment);
    return (
        <>
            {spin ? <Spinner /> :
                <div className={styles.mainDiv}>
                    <div className={styles.contentDiv}>
                        <div>
                            <AssignmentIcon className={styles.AssgIcon} />
                        </div>
                        <div className={styles.midDiv}>
                            <h4 className={styles.AssgnName}>{truncate(assignment.title)}</h4>
                            <p className={styles.teacher}>{TeacherName} <span className={styles.dot}>.</span> {month[(assignment.creationTime.substring(5, 7)) - 1]} {assignment.creationTime.substring(8, 10)}</p>
                            <div className={styles.pointsanddue}>
                                {assignment.maxPoints ? <p className={styles.points}>{assignment.maxPoints} Points</p> : <p className={styles.points}>Ungraded</p>}
                                <div className={styles.duediv}>
                                    {assignment.dueDate ? <p className={styles.due}>Due {assignment.dueDate.day}/{assignment.dueDate.month}/{assignment.dueDate.year}, {assignment.dueTime.minutes ? conversion(assignment.dueTime.hours, assignment.dueTime.minutes) : none(assignment.dueTime.hours)} </p> : <p className={styles.due}>No Due Date</p>}
                                </div>
                            </div>
                            <Line className={styles.line} />
                            <p className={styles.AssignmentSubtitle}>{assignment.description}</p>
                            {assignment.materials ?
                                <a href={assignment.materials[0].driveFile.driveFile.alternateLink} target="_blank">
                                    <div className={styles.uploadDoc}>
                                        <img id={styles.thumbnail1} src={assignment.materials[0].driveFile.driveFile.thumbnailUrl} />
                                        <div id={styles.written}>
                                            <p id={styles.ques}>{assignment.materials[0].driveFile.driveFile.title}</p>
                                            <p id={styles.type}>PDF</p>
                                        </div>
                                    </div>
                                </a> :
                                <div className={styles.uploadDoc}>
                                    <img id={styles.thumbnail1} src={thumbnail} />
                                    <div id={styles.written}>
                                        <p id={styles.ques}>No Question Paper Uploaded</p>
                                        {/* <p id={styles.type}>PDF</p> */}
                                    </div>
                                </div>
                            }
                        </div>
                        <div className={styles.moreIcon}>
                            <MoreIcon />
                        </div>
                    </div>
                    <div className={styles.pdfDiv}>
                        {/* <a href={assignment.assignment.studentWorkFolder.alternateLink} target="_blank">
                            <button className={styles.btn1}>View student Submissions</button>
                        </a> */}
                        <ActivatePeerLearning allAssignments={allAssignments} setPeerAssignments={setPeerAssignments}/>
                    </div>
                </div>}
            {<img src={bottom} alt="Image" className={styles.bottom} />}
        </>
    );
}