import parse from 'html-react-parser'
import React from 'react'
import ShowMoreText from "react-show-more-text";

function ProductDescriptionSeeMore({ text }) {
    return (

        <div className="min-w-[250px] max-w-[280px] leading-6" style={{ whiteSpace: "break-spaces" }}>
            <ShowMoreText
                lines={2}
                more="Show more"
                less="Show less"
                anchorClass="text-blue-600"
                expanded={false}
                width={280}
                truncatedEndingComponent={"... "}
            >
                {text ? parse(text) : '---'}
            </ShowMoreText>
        </div>
    )
}

export default ProductDescriptionSeeMore
