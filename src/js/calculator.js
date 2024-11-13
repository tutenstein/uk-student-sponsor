
const FEES = {
    standard: {
        inside: {
            3: 827,
            5: 1636
        },
        outside: {
            3: 719,
            5: 1420
        }
    },
    shortage: {
        inside: {
            3: 551,
            5: 1084
        },
        outside: {
            3: 551,
            5: 1084
        }
    },
    healthcare: {
        inside: {
            3: 284,
            5: 551
        },
        outside: {
            3: 284,
            5: 551
        }
    },
    ihs: {
        adult: 1035,
        child: 776
    },
    priority: {
        priority: 500,
        super: 1000
    }
};

function calculateFees() {
    const location = document.querySelector('input[name="location"]:checked')?.value;
    if (!location) {
        alert('Please select application location');
        return;
    }

    const duration = parseInt(document.getElementById('duration').value);
    const jobType = document.getElementById('jobType').value;
    const hasPartner = parseInt(document.getElementById('hasPartner').value);
    const childDependents = parseInt(document.getElementById('childDependents').value);
    const priorityService = document.getElementById('priorityService').value;

    // Calculate base visa fee
    let baseFee;
    if (duration <= 3) {
        baseFee = FEES[jobType][location][3];
    } else {
        baseFee = FEES[jobType][location][5];
    }

    // Calculate dependent visa fees
    const partnerVisaFees = hasPartner ? baseFee : 0;
    const childrenVisaFees = baseFee * childDependents;
    const dependentVisaFees = partnerVisaFees + childrenVisaFees;

    // Calculate IHS
    const mainApplicantIHS = FEES.ihs.adult * duration;
    const partnerIHS = hasPartner ? FEES.ihs.adult * duration : 0;
    const childIHS = FEES.ihs.child * duration * childDependents;
    const totalIHS = mainApplicantIHS + partnerIHS + childIHS;

    // Calculate priority fee
    const priorityFee = priorityService !== 'none' ? FEES.priority[priorityService] : 0;

    // Calculate totals
    const totalVisaFee = baseFee + dependentVisaFees;
    const totalCost = totalVisaFee + totalIHS + priorityFee;

    // Update display
    document.getElementById('visaFee').textContent = `£${baseFee}`;
    document.getElementById('ihsFee').textContent = `£${totalIHS}`;
    document.getElementById('priorityFee').textContent = `£${priorityFee}`;
    document.getElementById('dependentFees').textContent = `£${dependentVisaFees}`;
    document.getElementById('totalCost').textContent = `£${totalCost}`;

    let explanation = `
<p><strong>Detailed Breakdown of Fees:</strong></p>
<ol>
    <li><strong>Base Visa Fee:</strong> £${baseFee}
        <ul>
            <li>Based on ${location} UK application</li>
            <li>For ${duration} year(s) duration</li>
            <li>Job type: ${jobType}</li>
        </ul>
    </li>

    <li><strong>Healthcare Surcharge (IHS):</strong>
        <ul>
            <li>Main applicant: £${mainApplicantIHS} (£${FEES.ihs.adult} × ${duration} years)</li>
            ${hasPartner ? `<li>Partner: £${partnerIHS} (£${FEES.ihs.adult} × ${duration} years)</li>` : ''}
            ${childDependents > 0 ? `<li>Children: £${childIHS} (£${FEES.ihs.child} × ${duration} years × ${childDependents} children)</li>` : ''}
        </ul>
    </li>

    ${dependentVisaFees > 0 ? `
    <li><strong>Dependent Visa Fees:</strong>
        <ul>
            ${hasPartner ? `<li>Partner visa fee: £${partnerVisaFees}</li>` : ''}
            ${childDependents > 0 ? `<li>Children visa fees: £${childrenVisaFees} (£${baseFee} × ${childDependents})</li>` : ''}
        </ul>
    </li>
    ` : ''}

    ${priorityFee > 0 ? `
    <li><strong>Priority Service Fee:</strong> £${priorityFee}
        <ul>
            <li>Service type: ${priorityService}</li>
        </ul>
    </li>
    ` : ''}

    <li><strong>Total Cost Breakdown:</strong>
        <ul>
            <li>Base visa fee: £${baseFee}</li>
            <li>Total IHS: £${totalIHS}</li>
            <li>Dependent fees: £${dependentVisaFees}</li>
            <li>Priority fee: £${priorityFee}</li>
            <li><strong>Final total: £${totalCost}</strong></li>
        </ul>
    </li>
</ol>
`;

document.getElementById('explanationText').innerHTML = explanation;
}
