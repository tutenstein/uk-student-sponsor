const FEES = {
    student: {
        application: {
            inside: 490,
            outside: 490
        },
        ihs: 624 // per year
    },
    childStudent: {
        application: {
            inside: 490,
            outside: 490
        },
        ihs: 470 // per year
    },
    shortTerm: {
        application: {
            inside: 200,
            outside: 200
        },
        ihs: 776 // fixed
    },
    dependent: {
        partner: 490,
        child: 490
    },
    priority: {
        priority: 500,
        super: 1000
    }
};

function calculateFees() {
    const visaType = document.getElementById('visaType').value;
    const location = document.querySelector('input[name="location"]:checked')?.value;
    const duration = parseInt(document.getElementById('duration').value);
    const hasPartner = parseInt(document.getElementById('hasPartner').value);
    const childDependents = parseInt(document.getElementById('childDependents').value);
    const priorityService = document.getElementById('priorityService').value;

    // Validation for location based on visa type
    if (visaType !== 'shortTerm' && !location) {
        alert('Please select application location');
        return;
    }

    // Calculate application fee
    let applicationFee;
    if (visaType === 'shortTerm') {
        applicationFee = FEES[visaType].application.outside; // Short-term is typically applied from outside
    } else {
        applicationFee = FEES[visaType].application[location];
    }

    // Calculate Healthcare Surcharge (IHS)
    let ihsFee;
    if (visaType === 'shortTerm') {
        ihsFee = FEES[visaType].ihs;
    } else {
        ihsFee = FEES[visaType].ihs * duration;
    }

    // Calculate dependent fees
    let dependentVisaFees = 0;
    if (hasPartner) {
        dependentVisaFees += FEES.dependent.partner;
    }
    if (childDependents > 0) {
        dependentVisaFees += FEES.dependent.child * childDependents;
    }

    // Calculate priority fee
    const priorityFee = priorityService !== 'none' ? FEES.priority[priorityService] : 0;

    // Calculate totals
    const totalFees = applicationFee + ihsFee + dependentVisaFees + priorityFee;

    // Update display
    document.getElementById('visaFee').textContent = `£${applicationFee}`;
    document.getElementById('ihsFee').textContent = `£${ihsFee}`;
    document.getElementById('priorityFee').textContent = `£${priorityFee}`;
    document.getElementById('dependentFees').textContent = `£${dependentVisaFees}`;
    document.getElementById('totalCost').textContent = `£${totalFees}`;

    // Generate explanation
    let explanation = `
<p><strong>Detailed Breakdown of Fees:</strong></p>
<ol>
    <li><strong>Visa Application Fee:</strong> £${applicationFee}
        <ul>
            <li>Visa Type: ${getVisaTypeDescription(visaType)}</li>
            ${visaType !== 'shortTerm' ? `<li>Application Location: ${capitalize(location)} UK</li>` : ''}
        </ul>
    </li>

    <li><strong>Healthcare Surcharge (IHS):</strong> £${ihsFee}
        <ul>
            ${visaType === 'shortTerm' ? `<li>Fixed Healthcare Surcharge for Short-term Study Visa</li>` :
                `<li>£${FEES[visaType].ihs} × ${duration} year(s)</li>`}
        </ul>
    </li>

    ${dependentVisaFees > 0 ? `
    <li><strong>Dependent Visa Fees:</strong> £${dependentVisaFees}
        <ul>
            ${hasPartner ? `<li>Partner/Spouse visa fee: £${FEES.dependent.partner}</li>` : ''}
            ${childDependents > 0 ? `<li>Children visa fees: £${FEES.dependent.child} × ${childDependents} = £${FEES.dependent.child * childDependents}</li>` : ''}
        </ul>
    </li>
    ` : ''}

    ${priorityFee > 0 ? `
    <li><strong>Priority Service Fee:</strong> £${priorityFee}
        <ul>
            <li>Service type: ${capitalize(priorityService)}</li>
        </ul>
    </li>
    ` : ''}

    <li><strong>Total Cost Breakdown:</strong>
        <ul>
            <li>Visa Application Fee: £${applicationFee}</li>
            <li>Healthcare Surcharge (IHS): £${ihsFee}</li>
            <li>Dependent Fees: £${dependentVisaFees}</li>
            <li>Priority Fee: £${priorityFee}</li>
            <li><strong>Final Total: £${totalFees}</strong></li>
        </ul>
    </li>
</ol>
`;

    document.getElementById('explanationText').innerHTML = explanation;
}

function getVisaTypeDescription(type) {
    switch(type) {
        case 'student':
            return 'Student Visa';
        case 'childStudent':
            return 'Child Student Visa';
        case 'shortTerm':
            return 'Short-term Study Visa';
        default:
            return '';
    }
}

function capitalize(text) {
    if (text.length === 0) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}

window.calculateFees = calculateFees;
