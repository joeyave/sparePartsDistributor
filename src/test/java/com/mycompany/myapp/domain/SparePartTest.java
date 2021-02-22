package com.mycompany.myapp.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.mycompany.myapp.web.rest.TestUtil;

public class SparePartTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SparePart.class);
        SparePart sparePart1 = new SparePart();
        sparePart1.setId(1L);
        SparePart sparePart2 = new SparePart();
        sparePart2.setId(sparePart1.getId());
        assertThat(sparePart1).isEqualTo(sparePart2);
        sparePart2.setId(2L);
        assertThat(sparePart1).isNotEqualTo(sparePart2);
        sparePart1.setId(null);
        assertThat(sparePart1).isNotEqualTo(sparePart2);
    }
}
